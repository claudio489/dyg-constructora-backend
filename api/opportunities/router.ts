import { z } from "zod";
import { router, publicProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { opportunities, matches } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";
import { analyzeLicitacion } from "../services/ai-analyzer";
import { scrapeMercadoPublico } from "../scraper/engine";
import { normalize } from "../scraper/normalizer";
import { runMatch } from "../services/match-engine";

export const opportunitiesRouter = router({
  // ─── Generate pipeline: scrape → normalize → analyze → match ────────────
  generate: publicProcedure
    .input(
      z.object({
        fuente: z.enum(["mercado-publico", "all"]).default("mercado-publico"),
        maxResultados: z.number().min(1).max(200).default(50),
        soloBiobio: z.boolean().default(false),
        minScore: z.number().min(0).max(100).default(40),
      }).optional(),
    )
    .mutation(async ({ input }) => {
      const t0 = Date.now();
      const opts = input || {};

      try {
        // Scrape
        const scrapeResult = await scrapeMercadoPublico({ maxPaginas: 1 });
        if (scrapeResult.totalExtraido === 0) {
          return {
            success: true,
            count: 0,
            pipeline: {
              fuente: scrapeResult.fuente,
              fechaExtraccion: scrapeResult.fechaExtraccion,
              duracionMs: Date.now() - t0,
              totalScrapeados: 0,
              totalNormalizados: 0,
              duplicadosEliminados: 0,
              guardadosEnDB: 0,
              errores: scrapeResult.errores.length,
              mensaje: "No se encontraron licitaciones activas",
            },
            data: [] as any[],
          };
        }

        // Normalize
        const { clean, report } = normalize(scrapeResult.licitaciones);
        let filtered = clean;
        if (opts.soloBiobio) {
          filtered = clean.filter((lic) => lic.region.toLowerCase().includes("biobio"));
        }

        // Analyze + Match
        const toProcess = filtered.slice(0, opts.maxResultados || 50);
        const analyzed: any[] = [];

        for (const lic of toProcess) {
          try {
            const aiResult = await analyzeLicitacion({
              titulo: lic.titulo,
              descripcion: lic.descripcion,
              entidad: lic.entidad,
              montoEstimado: lic.montoEstimado,
              region: lic.region,
              comuna: lic.comuna,
              categoria: lic.categoria,
              palabrasClave: lic.palabrasClave,
            }).catch(() => null);

            const matchResult = runMatch(lic);

            analyzed.push({ licitacion: lic, ai: aiResult, match: matchResult });
          } catch (e) {
            console.error("[tRPC generate] Analysis error for", lic.id, e);
          }
        }

        const minScore = opts.minScore || 40;
        const scored = analyzed.filter((a) => (a.ai?.score ?? a.match?.matchScore ?? 50) >= minScore);

        // Store in DB (best effort)
        let guardadosEnDB = 0;
        try {
          const db = getDb();
          for (const item of scored) {
            const lic = item.licitacion;
            try {
              const existing = await db.select().from(opportunities).where(eq(opportunities.mpId, lic.id)).limit(1);
              let oppId: number;
              if (existing.length > 0) {
                oppId = existing[0].id;
                await db.update(opportunities).set({
                  nombre: lic.titulo,
                  descripcion: lic.descripcion,
                  organismo: lic.entidad,
                  region: lic.region,
                  comuna: lic.comuna,
                  montoEstimado: lic.montoEstimado ? String(lic.montoEstimado) : null,
                  fechaPublicacion: lic.fechaPublicacion ? new Date(lic.fechaPublicacion) : null,
                  fechaCierre: lic.fechaCierre ? new Date(lic.fechaCierre) : null,
                  estado: mapEstado(lic.estado),
                  categoriaMp: lic.categoria,
                  updatedAt: new Date(),
                }).where(eq(opportunities.id, oppId));
              } else {
                const insertResult = await db.insert(opportunities).values({
                  mpId: lic.id,
                  codigo: lic.id,
                  nombre: lic.titulo,
                  descripcion: lic.descripcion,
                  organismo: lic.entidad,
                  region: lic.region,
                  comuna: lic.comuna,
                  montoEstimado: lic.montoEstimado ? String(lic.montoEstimado) : null,
                  fechaPublicacion: lic.fechaPublicacion ? new Date(lic.fechaPublicacion) : null,
                  fechaCierre: lic.fechaCierre ? new Date(lic.fechaCierre) : null,
                  estado: mapEstado(lic.estado),
                  categoriaMp: lic.categoria,
                });
                oppId = Number(insertResult.insertId);
              }

              if (item.match) {
                const existingMatch = await db.select().from(matches).where(eq(matches.opportunityId, oppId)).limit(1);
                if (existingMatch.length > 0) {
                  await db.update(matches).set({
                    score: item.match.matchScore,
                    categoriaDg: inferCategoriaDg(lic.categoria),
                    subcategoria: item.match.probability,
                    keywordsMatched: lic.palabrasClave,
                    prioridad: item.match.matchScore >= 75 ? "alta" : item.match.matchScore >= 50 ? "media" : "baja",
                    updatedAt: new Date(),
                  }).where(eq(matches.id, existingMatch[0].id));
                } else {
                  await db.insert(matches).values({
                    opportunityId: oppId,
                    score: item.match.matchScore,
                    categoriaDg: inferCategoriaDg(lic.categoria),
                    subcategoria: item.match.probability,
                    keywordsMatched: lic.palabrasClave,
                    estado: "review",
                    prioridad: item.match.matchScore >= 75 ? "alta" : item.match.matchScore >= 50 ? "media" : "baja",
                  }).catch(() => {});
                }
              }
              guardadosEnDB++;
            } catch (dbErr) {
              console.error("[tRPC generate] DB error for", lic.id, dbErr);
            }
          }
        } catch (dbErr) {
          console.error("[tRPC generate] Global DB error:", dbErr);
        }

        const data = scored.map((item) => ({
          id: item.licitacion.id,
          titulo: item.licitacion.titulo,
          entidad: item.licitacion.entidad,
          region: item.licitacion.region,
          comuna: item.licitacion.comuna,
          montoEstimado: item.licitacion.montoEstimado,
          estado: item.licitacion.estado,
          categoria: item.licitacion.categoria,
          link: item.licitacion.link,
          aiScore: item.ai?.score ?? null,
          aiRecomendacion: item.ai?.recomendacion ?? null,
          matchScore: item.match?.matchScore ?? null,
          matchProbability: item.match?.probability ?? null,
        }));

        return {
          success: true,
          count: data.length,
          pipeline: {
            fuente: scrapeResult.fuente,
            fechaExtraccion: scrapeResult.fechaExtraccion,
            duracionMs: Date.now() - t0,
            totalScrapeados: scrapeResult.totalExtraido,
            totalNormalizados: report.totalNormalizado,
            duplicadosEliminados: report.duplicadosEliminados,
            guardadosEnDB,
            errores: scrapeResult.errores.length + report.errores.length,
          },
          data,
        };
      } catch (err) {
        console.error("[tRPC generate] Fatal error:", err);
        return {
          success: false,
          count: 0,
          pipeline: { duracionMs: Date.now() - t0, totalScrapeados: 0, totalNormalizados: 0, duplicadosEliminados: 0, guardadosEnDB: 0, errores: 1 },
          data: [] as any[],
          error: err instanceof Error ? err.message : String(err),
        };
      }
    }),

  // ─── List stored opportunities ──────────────────────────────────────────
  list: publicProcedure
    .input(
      z.object({
        estado: z.string().optional(),
        region: z.string().optional(),
        minScore: z.number().optional(),
        limit: z.number().min(1).max(1000).default(100),
      }).optional(),
    )
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const filters = input || {};

        let query = db.select().from(opportunities) as any;
        const conditions = [];

        if (filters.estado) conditions.push(eq(opportunities.estado, filters.estado));
        if (filters.region) conditions.push(eq(opportunities.region, filters.region));

        if (conditions.length > 0) query = query.where(and(...conditions));

        const rows = await query.orderBy(desc(opportunities.createdAt)).limit(filters.limit || 100);

        const oppIds = rows.map((r: any) => r.id);
        const matchRows = oppIds.length > 0
          ? await db.select().from(matches).where(eq(matches.opportunityId, oppIds[0]))
          : [];

        const matchMap = new Map<number, typeof matchRows[0]>();
        for (const m of matchRows) matchMap.set(m.opportunityId, m);

        return rows.map((r: any) => ({
          ...r,
          matchScore: matchMap.get(r.id)?.score || 0,
          matchCategoria: matchMap.get(r.id)?.categoriaDg || null,
        }));
      } catch (err) {
        console.error("[opportunities.list] DB error:", err);
        return [];
      }
    }),

  // ─── Get single opportunity ─────────────────────────────────────────────
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const db = getDb();
        const rows = await db.select().from(opportunities).where(eq(opportunities.id, input.id));
        return rows[0] || null;
      } catch {
        return null;
      }
    }),

  // ─── AI Analysis ────────────────────────────────────────────────────────
  analyze: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const db = getDb();
        const rows = await db.select().from(opportunities).where(eq(opportunities.id, input.id));
        const opp = rows[0];
        if (!opp) throw new Error("Opportunity not found");

        const result = await analyzeLicitacion({
          titulo: opp.nombre,
          descripcion: opp.descripcion || "",
          entidad: opp.organismo || "",
          montoEstimado: opp.montoEstimado ? parseFloat(opp.montoEstimado) : null,
          region: opp.region || "",
          comuna: opp.comuna || "",
          categoria: opp.categoriaMp || "OTROS",
          palabrasClave: [],
        });

        return { opportunity: opp, analysis: result };
      } catch {
        return { opportunity: null, analysis: null };
      }
    }),

  // ─── Stats ──────────────────────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
    try {
      const db = getDb();
      const all = await db.select().from(opportunities);

      const byEstado: Record<string, number> = {};
      const byRegion: Record<string, number> = {};
      let totalMonto = 0;
      let countMonto = 0;

      for (const o of all) {
        byEstado[o.estado] = (byEstado[o.estado] || 0) + 1;
        if (o.region) byRegion[o.region] = (byRegion[o.region] || 0) + 1;
        if (o.montoEstimado) {
          const val = parseFloat(o.montoEstimado);
          if (!isNaN(val)) { totalMonto += val; countMonto++; }
        }
      }

      return { total: all.length, byEstado, byRegion, avgMonto: countMonto > 0 ? totalMonto / countMonto : 0 };
    } catch {
      return { total: 0, byEstado: {}, byRegion: {}, avgMonto: 0 };
    }
  }),
});

function mapEstado(estado: string): "Publicada" | "Cerrada" | "Adjudicada" | "Desierta" {
  const map: Record<string, any> = {
    "Publicada": "Publicada",
    "Cerrada": "Cerrada",
    "Desierta": "Desierta",
    "Adjudicada": "Adjudicada",
    "Revocada": "Cerrada",
    "Suspendida": "Cerrada",
  };
  return map[estado] || "Publicada";
}

function inferCategoriaDg(categoria: string): "CONSTRUCCION" | "HVAC" | "MONTAJE" | "MULTISERVICIO" {
  const cat = categoria.toUpperCase();
  if (cat.includes("HVAC") || cat.includes("CLIMATIZ")) return "HVAC";
  if (cat.includes("MONTAJE")) return "MONTAJE";
  if (cat.includes("CONSTRUCC")) return "CONSTRUCCION";
  return "MULTISERVICIO";
}
