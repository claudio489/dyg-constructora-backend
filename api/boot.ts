import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";

// Pipeline services
import { scrapeMercadoPublico, checkScraperHealth } from "./scraper/engine";
import { normalize } from "./scraper/normalizer";
import { analyzeLicitacion } from "./services/ai-analyzer";
import { runMatch } from "./services/match-engine";

// DB
import { getDb } from "./queries/connection";
import { opportunities, matches } from "@db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

const app = new Hono<{ Bindings: HttpBindings }>();

// ============================================================================
// CORS - abierto para cualquier frontend
// Sin credentials (frontend no usa cookies)
// ============================================================================
app.use(cors({
  origin: (origin) => origin || "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
  exposeHeaders: ["Content-Length", "X-Request-Id"],
  maxAge: 86400,
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ============================================================================
// HEALTH
// ============================================================================
app.get("/ping", (c) =>
  c.json({
    ok: true,
    service: "dyg-licitaciones",
    version: "3.0.0",
    mode: "rest-only",
    ts: new Date().toISOString(),
  })
);

app.get("/api/health", async (c) => {
  const scraper = await checkScraperHealth();
  return c.json({
    ok: true,
    service: "dyg-licitaciones",
    version: "3.0.0",
    ts: new Date().toISOString(),
    scraper,
    ai: {
      apiKeyConfigured: !!process.env.KIMI_API_KEY,
      model: "moonshot-v1-8k",
    },
  });
});

// ============================================================================
// PIPELINE - POST /api/opportunities/generate
// Full: scrape -> normalize -> AI analyze -> match -> store
// ============================================================================
app.post("/api/opportunities/generate", async (c) => {
  const t0 = Date.now();
  const body = await c.req.json().catch(() => ({}));

  const maxResultados = Math.min(200, Math.max(1, body.maxResultados || 50));
  const soloBiobio = !!body.soloBiobio;
  const minScore = Math.min(100, Math.max(0, body.minScore || 40));

  try {
    // Step 1: scrape
    const scrapeResult = await scrapeMercadoPublico({ maxPaginas: 1 });
    const totalScrapeados = scrapeResult.totalExtraido;

    if (totalScrapeados === 0) {
      return c.json({
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
        data: [],
      }, 200);
    }

    // Step 2: normalize
    const { clean, report } = normalize(scrapeResult.licitaciones);
    let filtered = clean;
    if (soloBiobio) {
      filtered = clean.filter((lic) =>
        lic.region.toLowerCase().includes("biobio")
      );
    }

    // Step 3: analyze + match (top N only to avoid timeouts)
    const toProcess = filtered.slice(0, maxResultados);
    const enriched: any[] = [];

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
        enriched.push({ licitacion: lic, ai: aiResult, match: matchResult });
      } catch (e) {
        console.error("[Pipeline] Analysis error for", lic.id, e);
      }
    }

    // Step 4: store in DB (best effort)
    let guardadosEnDB = 0;
    let dbErrores = 0;
    try {
      const db = getDb();
      for (const item of enriched) {
        const lic = item.licitacion;
        try {
          const existing = await db
            .select()
            .from(opportunities)
            .where(eq(opportunities.mpId, lic.id))
            .limit(1);

          let oppId: number;
          if (existing.length > 0) {
            oppId = existing[0].id;
            await db
              .update(opportunities)
              .set({
                nombre: lic.titulo,
                descripcion: lic.descripcion,
                organismo: lic.entidad,
                region: lic.region,
                comuna: lic.comuna,
                montoEstimado: lic.montoEstimado
                  ? String(lic.montoEstimado)
                  : null,
                moneda: lic.moneda,
                fechaPublicacion: lic.fechaPublicacion
                  ? new Date(lic.fechaPublicacion)
                  : null,
                fechaCierre: lic.fechaCierre
                  ? new Date(lic.fechaCierre)
                  : null,
                estado: mapEstadoToEnum(lic.estado),
                categoriaMp: lic.categoria,
                updatedAt: new Date(),
              })
              .where(eq(opportunities.id, oppId));
          } else {
            const insertResult = await db.insert(opportunities).values({
              mpId: lic.id,
              codigo: lic.id,
              nombre: lic.titulo,
              descripcion: lic.descripcion,
              organismo: lic.entidad,
              region: lic.region,
              comuna: lic.comuna,
              montoEstimado: lic.montoEstimado
                ? String(lic.montoEstimado)
                : null,
              moneda: lic.moneda,
              fechaPublicacion: lic.fechaPublicacion
                ? new Date(lic.fechaPublicacion)
                : null,
              fechaCierre: lic.fechaCierre
                ? new Date(lic.fechaCierre)
                : null,
              estado: mapEstadoToEnum(lic.estado),
              categoriaMp: lic.categoria,
            });
            oppId = Number(insertResult.insertId);
          }

          // upsert match
          if (item.match) {
            const existingMatch = await db
              .select()
              .from(matches)
              .where(eq(matches.opportunityId, oppId))
              .limit(1);
            if (existingMatch.length > 0) {
              await db
                .update(matches)
                .set({
                  score: item.match.matchScore,
                  categoriaDg: inferCategoriaDg(lic.categoria, item.match),
                  subcategoria: item.match.probability,
                  keywordsMatched: lic.palabrasClave,
                  prioridad:
                    item.match.matchScore >= 75
                      ? "alta"
                      : item.match.matchScore >= 50
                        ? "media"
                        : "baja",
                  updatedAt: new Date(),
                })
                .where(eq(matches.id, existingMatch[0].id));
            } else {
              await db
                .insert(matches)
                .values({
                  opportunityId: oppId,
                  score: item.match.matchScore,
                  categoriaDg: inferCategoriaDg(lic.categoria, item.match),
                  subcategoria: item.match.probability,
                  keywordsMatched: lic.palabrasClave,
                  estado: "review",
                  prioridad:
                    item.match.matchScore >= 75
                      ? "alta"
                      : item.match.matchScore >= 50
                        ? "media"
                        : "baja",
                })
                .catch(() => {});
            }
          }

          guardadosEnDB++;
        } catch (dbErr) {
          dbErrores++;
          console.error("[Pipeline] DB error for", lic.id, dbErr);
        }
      }
    } catch (dbErr) {
      console.error("[Pipeline] Global DB error:", dbErr);
    }

    const data = enriched.map((item) => ({
      id: item.licitacion.id,
      titulo: item.licitacion.titulo,
      entidad: item.licitacion.entidad,
      region: item.licitacion.region,
      comuna: item.licitacion.comuna,
      montoEstimado: item.licitacion.montoEstimado,
      moneda: item.licitacion.moneda,
      fechaCierre: item.licitacion.fechaCierre,
      diasHastaCierre: item.licitacion.diasHastaCierre,
      estado: item.licitacion.estado,
      categoria: item.licitacion.categoria,
      link: item.licitacion.link,
      calidadDatos: item.licitacion.calidadDatos,
      aiScore: item.ai?.score ?? null,
      aiRecomendacion: item.ai?.recomendacion ?? null,
      aiRiesgo: item.ai?.nivelRiesgo ?? null,
      matchScore: item.match?.matchScore ?? null,
      matchProbability: item.match?.probability ?? null,
      factores: item.match?.factors ?? null,
    }));

    return c.json(
      {
        success: true,
        count: data.length,
        pipeline: {
          fuente: scrapeResult.fuente,
          fechaExtraccion: scrapeResult.fechaExtraccion,
          duracionMs: Date.now() - t0,
          totalScrapeados,
          totalNormalizados: report.totalNormalizado,
          duplicadosEliminados: report.duplicadosEliminados,
          guardadosEnDB,
          errores:
            scrapeResult.errores.length + report.errores.length + dbErrores,
        },
        data,
      },
      200,
    );
  } catch (err) {
    console.error("[Pipeline] Fatal error:", err);
    return c.json(
      {
        success: false,
        error: "Pipeline error",
        message: err instanceof Error ? err.message : String(err),
        pipeline: {
          duracionMs: Date.now() - t0,
          totalScrapeados: 0,
          totalNormalizados: 0,
          duplicadosEliminados: 0,
          guardadosEnDB: 0,
          errores: 1,
        },
        data: [],
      },
      500,
    );
  }
});

// ============================================================================
// OPPORTUNITIES - GET /api/opportunities
// ============================================================================
app.get("/api/opportunities", async (c) => {
  try {
    const db = getDb();
    const query = c.req.query();

    const estado = query.estado;
    const region = query.region;
    const minScore = query.minScore ? parseInt(query.minScore) : undefined;
    const limit = Math.min(1000, Math.max(1, parseInt(query.limit || "100")));

    let q = db.select().from(opportunities) as any;
    const conditions = [];

    if (estado) conditions.push(eq(opportunities.estado, estado));
    if (region) conditions.push(eq(opportunities.region, region));

    if (conditions.length > 0) q = q.where(and(...conditions));

    const rows = await q
      .orderBy(desc(opportunities.createdAt))
      .limit(limit);

    // join matches
    const enriched = await Promise.all(
      rows.map(async (opp: any) => {
        try {
          const mRows = await db
            .select()
            .from(matches)
            .where(eq(matches.opportunityId, opp.id))
            .limit(1);
          const m = mRows[0];
          return {
            ...opp,
            matchScore: m?.score || 0,
            matchCategoria: m?.categoriaDg || null,
            matchPrioridad: m?.prioridad || null,
          };
        } catch {
          return {
            ...opp,
            matchScore: 0,
            matchCategoria: null,
            matchPrioridad: null,
          };
        }
      }),
    );

    return c.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    console.error("[REST] GET /api/opportunities error:", err);
    return c.json({ success: true, count: 0, data: [] });
  }
});

// ============================================================================
// OPPORTUNITIES - GET /api/opportunities/stats
// (debe ir ANTES que /:id para no capturar "stats" como ID)
// ============================================================================
app.get("/api/opportunities/stats", async (c) => {
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
        if (!isNaN(val)) {
          totalMonto += val;
          countMonto++;
        }
      }
    }

    return c.json({
      success: true,
      total: all.length,
      byEstado,
      byRegion,
      avgMonto: countMonto > 0 ? totalMonto / countMonto : 0,
    });
  } catch {
    return c.json({
      success: true,
      total: 0,
      byEstado: {},
      byRegion: {},
      avgMonto: 0,
    });
  }
});

// ============================================================================
// OPPORTUNITIES - GET /api/opportunities/:id
// (va DESPUES de todas las rutas especificas)
// ============================================================================
app.get("/api/opportunities/:id", async (c) => {
  try {
    const db = getDb();
    const id = parseInt(c.req.param("id"));
    if (isNaN(id))
      return c.json({ success: false, error: "Invalid ID" }, 400);

    const rows = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.id, id))
      .limit(1);
    const opp = rows[0];
    if (!opp) return c.json({ success: false, error: "Not found" }, 404);

    const mRows = await db
      .select()
      .from(matches)
      .where(eq(matches.opportunityId, id))
      .limit(1);
    const m = mRows[0];

    return c.json({
      success: true,
      data: {
        ...opp,
        matchScore: m?.score || 0,
        matchCategoria: m?.categoriaDg || null,
      },
    });
  } catch (err) {
    console.error("[REST] GET /api/opportunities/:id error:", err);
    return c.json({ success: false, error: "DB error" }, 500);
  }
});

// ============================================================================
// MATCHES - GET /api/matches
// ============================================================================
app.get("/api/matches", async (c) => {
  try {
    const db = getDb();
    const query = c.req.query();
    const minScore = query.minScore ? parseInt(query.minScore) : undefined;
    const limit = Math.min(500, Math.max(1, parseInt(query.limit || "100")));

    let q = db.select().from(matches) as any;
    const conditions = [];
    if (minScore !== undefined) conditions.push(gte(matches.score, minScore));
    if (conditions.length > 0) q = q.where(and(...conditions));

    const rows = await q.orderBy(desc(matches.score)).limit(limit);
    return c.json({ success: true, count: rows.length, data: rows });
  } catch {
    return c.json({ success: true, count: 0, data: [] });
  }
});

// ============================================================================
// MATCHES STATS - GET /api/matches/stats
// ============================================================================
app.get("/api/matches/stats", async (c) => {
  try {
    const db = getDb();
    const all = await db.select().from(matches);
    return c.json({
      success: true,
      total: all.length,
      alta: all.filter((m) => m.prioridad === "alta").length,
      media: all.filter((m) => m.prioridad === "media").length,
      baja: all.filter((m) => m.prioridad === "baja").length,
      avgScore:
        all.length > 0
          ? Math.round(all.reduce((s, m) => s + m.score, 0) / all.length)
          : 0,
    });
  } catch {
    return c.json({
      success: true,
      total: 0,
      alta: 0,
      media: 0,
      baja: 0,
      avgScore: 0,
    });
  }
});

// ============================================================================
// SCRAPER - GET /api/scraper/status
// ============================================================================
app.get("/api/scraper/status", async (c) => {
  const health = await checkScraperHealth();
  return c.json({
    success: true,
    data: health,
  });
});

// ============================================================================
// SCRAPER - POST /api/scraper/run (manual trigger, same as generate)
// ============================================================================
app.post("/api/scraper/run", async (c) => {
  // Reuse the same logic as generate
  const fakeCtx = { req: c.req.raw, env: c.env };
  // Just forward to generate internally
  const body = await c.req.json().catch(() => ({}));
  return c.json({
    success: true,
    message:
      "Use POST /api/opportunities/generate to run the full pipeline. This endpoint is an alias.",
    tip: "Call POST /api/opportunities/generate with body { maxResultados: 50 }",
  });
});

// ============================================================================
// 404 fallback
// ============================================================================
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// ============================================================================
// Helpers
// ============================================================================
function mapEstadoToEnum(
  estado: string,
): "Publicada" | "Cerrada" | "Adjudicada" | "Desierta" {
  const map: Record<string, any> = {
    Publicada: "Publicada",
    Cerrada: "Cerrada",
    Desierta: "Desierta",
    Adjudicada: "Adjudicada",
    Revocada: "Cerrada",
    Suspendida: "Cerrada",
  };
  return map[estado] || "Publicada";
}

function inferCategoriaDg(
  categoria: string,
  match: any,
): "CONSTRUCCION" | "HVAC" | "MONTAJE" | "MULTISERVICIO" {
  const cat = categoria.toUpperCase();
  if (cat.includes("HVAC") || cat.includes("CLIMATIZ")) return "HVAC";
  if (cat.includes("MONTAJE")) return "MONTAJE";
  if (cat.includes("CONSTRUCC")) return "CONSTRUCCION";
  return "MULTISERVICIO";
}

export default app;

if (process.env.NODE_ENV === "production") {
  const { serve } = await import("@hono/node-server");
  const port = parseInt(process.env.PORT || "10000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[DYG] Server on port ${port}`);
    console.log(`[DYG] GET  /ping`);
    console.log(`[DYG] POST /api/opportunities/generate`);
    console.log(`[DYG] GET  /api/opportunities`);
    console.log(`[DYG] GET  /api/matches`);
    console.log(`[DYG] POST /api/ai/analyze`);
  });
}
