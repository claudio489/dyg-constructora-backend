import { z } from "zod";
import { router, publicProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { opportunities } from "../../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { scrapeMercadoPublico } from "../scraper/engine";
import { normalize } from "../scraper/normalizer";
import { analyzeLicitacion } from "../services/ai-analyzer";
import { runMatch } from "../services/match-engine";
import type { CleanLicitacion } from "../scraper/normalizer";

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
      const opts = input || {};
      const startTime = Date.now();

      // 1. SCRAPE
      console.log("[Pipeline] Step 1: Scraping...");
      const scrapeResult = await scrapeMercadoPublico({
        ticket: process.env.MP_TICKET,
      });

      if (scrapeResult.errores.length > 0) {
        console.warn("[Pipeline] Scraper errors:", scrapeResult.errores.length);
      }

      // 2. NORMALIZE
      console.log("[Pipeline] Step 2: Normalizing...");
      const { clean: normalized, report: normReport } = normalize(scrapeResult.licitaciones);

      // 3. FILTER
      let filtered = normalized;
      if (opts.soloBiobio) {
        filtered = filtered.filter((l) => l.region.toLowerCase().includes("biobío") || l.region.toLowerCase().includes("biobio"));
      }

      // 4. ANALYZE + MATCH
      console.log("[Pipeline] Step 3: AI Analysis + Matching...");
      const enriched = [];

      for (const lic of filtered.slice(0, opts.maxResultados || 50)) {
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
          });

          const matchResult = runMatch(lic);

          enriched.push({
            ...lic,
            ai: aiResult,
            match: matchResult,
            combinedScore: Math.round((aiResult.score + matchResult.matchScore) / 2),
          });
        } catch (err) {
          console.error(`[Pipeline] Analysis failed for ${lic.id}:`, err);
          enriched.push({
            ...lic,
            ai: null,
            match: null,
            combinedScore: 0,
          });
        }
      }

      // 5. SORT by combined score
      enriched.sort((a, b) => (b.combinedScore || 0) - (a.combinedScore || 0));

      // 6. FILTER by min score
      const final = enriched.filter((e) => (e.combinedScore || 0) >= (opts.minScore || 40));

      // 7. SAVE to DB
      const db = getDb();
      let saved = 0;
      for (const e of final) {
        try {
          const existing = await db.select().from(opportunities).where(eq(opportunities.mpId, e.id));
          if (existing.length > 0) continue;

          await db.insert(opportunities).values({
            mpId: e.id,
            codigo: e.id,
            nombre: e.titulo,
            descripcion: e.descripcion,
            organismo: e.entidad,
            region: e.region,
            comuna: e.comuna,
            montoEstimado: e.montoEstimado ? e.montoEstimado.toString() : null,
            estado: e.estado as any,
            categoriaMp: e.categoria,
            fechaPublicacion: e.fechaPublicacion ? new Date(e.fechaPublicacion) : null,
            fechaCierre: e.fechaCierre ? new Date(e.fechaCierre) : null,
            rawData: { ai: e.ai, match: e.match, combinedScore: e.combinedScore },
          });
          saved++;
        } catch (err) {
          console.error(`[Pipeline] DB save failed for ${e.id}:`, err);
        }
      }

      const durationMs = Date.now() - startTime;

      return {
        success: true,
        count: final.length,
        pipeline: {
          fuente: scrapeResult.fuente,
          fechaExtraccion: scrapeResult.fechaExtraccion,
          duracionMs,
          totalScrapeados: scrapeResult.totalExtraido,
          totalNormalizados: normReport.totalNormalizado,
          duplicadosEliminados: normReport.duplicadosEliminados,
          guardadosEnDB: saved,
          errores: scrapeResult.errores.length,
        },
        data: final.map((e) => ({
          id: e.id,
          titulo: e.titulo,
          entidad: e.entidad,
          monto: e.montoEstimado,
          region: e.region,
          comuna: e.comuna,
          diasHastaCierre: e.diasHastaCierre,
          categoria: e.categoria,
          link: e.link,
          score: e.combinedScore,
          ai: e.ai,
          match: e.match,
        })),
      };
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
      const db = getDb();
      const filters = input || {};

      let query = db.select().from(opportunities);
      const conditions = [];

      if (filters.estado) conditions.push(eq(opportunities.estado, filters.estado as any));
      if (filters.region) conditions.push(eq(opportunities.region, filters.region));

      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      return await query.orderBy(desc(opportunities.createdAt)).limit(filters.limit || 100);
    }),

  // ─── Get single opportunity ────────────────────────────────────────────────
  byId: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(opportunities).where(eq(opportunities.id, input.id));
      return rows[0] || null;
    }),

  // ─── Stats ────────────────────────────────────────────────────────────────
  stats: publicProcedure.query(async () => {
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

    return {
      total: all.length,
      byEstado,
      byRegion,
      avgMonto: countMonto > 0 ? totalMonto / countMonto : 0,
    };
  }),
});
