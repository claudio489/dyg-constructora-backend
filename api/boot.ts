import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { serve } from "@hono/node-server";

// ==========================
// SERVICES (PIPELINE)
// ==========================
import { scrapeLicitaciones } from "./scraper/engine";
import { normalizeLicitaciones } from "./services/normalizer";
import { analyzeWithKimi } from "./services/kimi";
import { matchEngine } from "./services/match";

// ==========================
// APP
// ==========================
const app = new Hono();

// ==========================
// MIDDLEWARE
// ==========================
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.use("*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// ==========================
// HEALTH CHECK
// ==========================
app.get("/ping", (c) => {
  return c.json({
    ok: true,
    service: "dyg-licitaciones-backend",
    version: "3.1.0",
    ts: new Date().toISOString(),
  });
});

// ==========================
// PIPELINE PRINCIPAL
// ==========================
app.post("/api/opportunities/generate", async (c) => {
  try {
    // 1. SCRAPER
    const raw = await scrapeLicitaciones();

    // 2. NORMALIZER
    const normalized = normalizeLicitaciones(raw);

    // 3. AI ANALYSIS (KIMI fallback si no existe API)
    const analyzed = await analyzeWithKimi(normalized);

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

// ==========================
// LISTADO (mock / futura DB)
// ==========================
let DB: any[] = [];

app.get("/api/opportunities", (c) => {
  return c.json({
    success: true,
    data: DB,
  });
});

// guardar manual
app.post("/api/opportunities/save", async (c) => {
  const body = await c.req.json();
  DB.push(body);

  return c.json({
    success: true,
    saved: true,
  });
});

// ==========================
// SERVER (RENDER FIX)
// ==========================
const port = Number(process.env.PORT) || 10000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`[DYG-Licitaciones] server running on port ${port}`);