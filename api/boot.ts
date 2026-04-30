import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";

import { scrapeLicitaciones } from "./scraper/engine";
import { normalizeLicitaciones } from "./services/normalizer";
import { analyzeWithKimi } from "./services/kimi";
import { matchEngine } from "./services/match";

const app = new Hono();

// --------------------
// MIDDLEWARE
// --------------------
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.use("*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// --------------------
// HEALTH CHECK
// --------------------
app.get("/ping", (c) => {
  return c.json({
    ok: true,
    service: "dyg-licitaciones-backend",
    version: "3.0.0",
    ts: new Date().toISOString(),
  });
});

// =====================================================
// PIPELINE PRINCIPAL
// =====================================================
app.post("/api/opportunities/generate", async (c) => {
  try {
    // 1. SCRAPER
    const rawData = await scrapeLicitaciones();

    // 2. NORMALIZER
    const cleanData = normalizeLicitaciones(rawData);

    // 3. AI (KIMI)
    const analyzed = await analyzeWithKimi(cleanData);

    // 4. MATCH ENGINE
    const matched = matchEngine(analyzed);

    return c.json({
      success: true,
      count: matched.length,
      data: matched,
    });
  } catch (error) {
    console.error("[PIPELINE ERROR]", error);

    return c.json(
      {
        success: false,
        error: "pipeline_failed",
      },
      500
    );
  }
});

// =====================================================
// LISTADO SIMPLE (mock / futuro DB)
// =====================================================
let DB: any[] = [];

app.get("/api/opportunities", (c) => {
  return c.json({
    success: true,
    data: DB,
  });
});

// guardar resultados manualmente si quieres
app.post("/api/opportunities/save", async (c) => {
  const body = await c.req.json();
  DB.push(body);

  return c.json({
    success: true,
    saved: true,
  });
});

// --------------------
// EXPORT PARA RENDER
// --------------------
export default {
  fetch: app.fetch,
};