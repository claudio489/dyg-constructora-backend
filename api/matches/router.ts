import { z } from "zod";
import { router, publicProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { matches, opportunities } from "@db/schema";
import { eq, desc, and, gte } from "drizzle-orm";
import { runMatch } from "../services/match-engine";
import type { CleanLicitacion } from "../scraper/normalizer";

export const matchesRouter = router({
  // ─── List matches ────────────────────────────────────────────────────────
  list: publicProcedure
    .input(
      z.object({
        minScore: z.number().min(0).max(100).optional(),
        categoriaDg: z.enum(["CONSTRUCCION", "HVAC", "MONTAJE"]).optional(),
        prioridad: z.enum(["alta", "media", "baja"]).optional(),
        limit: z.number().min(1).max(500).default(100),
      }).optional(),
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const filters = input || {};

        let query = db.select().from(matches);
        const conditions = [];

        if (filters.minScore !== undefined) conditions.push(gte(matches.score, filters.minScore));
        if (filters.categoriaDg) conditions.push(eq(matches.categoriaDg, filters.categoriaDg));
        if (filters.prioridad) conditions.push(eq(matches.prioridad, filters.prioridad));

        if (conditions.length > 0) query = query.where(and(...conditions)) as any;

        return await query.orderBy(desc(matches.score)).limit(filters.limit || 100);
      } catch {
        return [];
      }
    }),

  // ─── Run match on a stored opportunity ──────────────────────────────────
  run: publicProcedure
    .input(z.object({ opportunityId: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        const oppRows = await db.select().from(opportunities).where(eq(opportunities.id, input.opportunityId));
        const opp = oppRows[0];
        if (!opp) throw new Error("Opportunity not found");

        const cleanLic: CleanLicitacion = {
          id: opp.mpId || String(opp.id),
          titulo: opp.nombre,
          entidad: opp.organismo || "",
          montoEstimado: opp.montoEstimado ? parseFloat(opp.montoEstimado) : null,
          moneda: "CLP",
          fechaPublicacion: opp.fechaPublicacion ? opp.fechaPublicacion.toISOString() : null,
          fechaCierre: opp.fechaCierre ? opp.fechaCierre.toISOString() : null,
          diasHastaCierre: opp.fechaCierre ? Math.ceil((opp.fechaCierre.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null,
          region: opp.region || "",
          comuna: opp.comuna || "",
          ubicacionNormalizada: `${opp.comuna}, ${opp.region}`,
          link: `https://www.mercadopublico.cl/Procurement/Modules/RFB/Details.aspx?id=${opp.mpId}`,
          estado: opp.estado,
          categoria: opp.categoriaMp || "OTROS",
          descripcion: opp.descripcion || "",
          palabrasClave: [],
          calidadDatos: 80,
        };

        const result = runMatch(cleanLic);

        await db.insert(matches).values({
          opportunityId: opp.id,
          score: result.matchScore,
          categoriaDg: result.factors.specialtyMatch ? (opp.categoriaMp || "CONSTRUCCION") as any : "CONSTRUCCION" as any,
          subcategoria: result.probability,
          keywordsMatched: result.detalleAjuste.slice(0, 5),
          estado: "review",
          prioridad: result.matchScore >= 75 ? "alta" : result.matchScore >= 50 ? "media" : "baja",
        }).catch(() => {});

        return result;
      } catch {
        return null;
      }
    }),

  // ─── Stats ────────────────────────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
    try {
      const db = getDb();
      const all = await db.select().from(matches);

      return {
        total: all.length,
        alta: all.filter((m) => m.prioridad === "alta").length,
        media: all.filter((m) => m.prioridad === "media").length,
        baja: all.filter((m) => m.prioridad === "baja").length,
        avgScore: all.length > 0 ? Math.round(all.reduce((s, m) => s + m.score, 0) / all.length) : 0,
      };
    } catch {
      return { total: 0, alta: 0, media: 0, baja: 0, avgScore: 0 };
    }
  }),
});
