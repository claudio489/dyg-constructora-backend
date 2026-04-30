import { Hono } from "hono";
import { scrapeLicitaciones } from "../scraper/engine";
import { normalizeLicitaciones } from "../services/normalizer";
import { matchEngine } from "../services/match";
import { analyzeWithKimi } from "../services/kimi";

export const opportunitiesRouter = new Hono();

/**
 * 🚀 GENERATE PIPELINE COMPLETO
 */
opportunitiesRouter.post("/generate", async (c) => {
  try {
    // 1. SCRAPER
    const raw = await scrapeLicitaciones();

    // 2. NORMALIZER (FIX IMPORT)
    const normalized = normalizeLicitaciones(raw);

    // 3. AI ANALYSIS
    const analyzed = await Promise.all(
      normalized.map(async (item) => {
        const ai = await analyzeWithKimi(item);
        const match = matchEngine(item);

        return {
          ...item,
          ai,
          match,
        };
      })
    );

    return c.json({
      success: true,
      count: analyzed.length,
      data: analyzed,
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: error.message,
      },
      500
    );
  }
});

/**
 * 📦 LIST (mock o DB futura)
 */
opportunitiesRouter.get("/list", async (c) => {
  return c.json({
    success: true,
    data: [],
  });
});