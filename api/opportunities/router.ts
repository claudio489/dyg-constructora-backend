import { Hono } from "hono";
import { scrapeLicitaciones } from "../scraper/engine";
import { normalizeLicitaciones } from "../services/normalizer";
import { matchEngine } from "../services/match";
import { analyzeWithKimi } from "../services/kimi";
import { safeJson } from "../utils/safe";

export const opportunitiesRouter = new Hono();

/**
 * 🚀 PIPELINE COMPLETO SEGURO
 */
opportunitiesRouter.post("/generate", async (c) => {
  try {
    console.log("[PIPELINE] start");

    // 1. SCRAPER
    const raw = await scrapeLicitaciones();
    console.log("[PIPELINE] raw:", raw?.length ?? 0);

    // 2. NORMALIZER
    const normalized = normalizeLicitaciones(raw);
    console.log("[PIPELINE] normalized:", normalized?.length ?? 0);

    // 3. AI + MATCH (PROTEGIDO)
    const analyzed = await Promise.all(
      normalized.map(async (item) => {
        let ai = null;
        let match = null;

        try {
          ai = await analyzeWithKimi(item);
        } catch (e) {
          console.log("[KIMI ERROR]", e);
        }

        try {
          match = matchEngine(item);
        } catch (e) {
          console.log("[MATCH ERROR]", e);
        }

        return {
          ...item,
          ai,
          match,
        };
      })
    );

    console.log("[PIPELINE] analyzed:", analyzed.length);

    return c.json({
      success: true,
      count: analyzed.length,
      data: safeJson(analyzed),
    });
  } catch (error: any) {
    console.error("[PIPELINE ERROR]", error);

    return c.json(
      {
        success: false,
        error: error?.message ?? "unknown error",
      },
      500
    );
  }
});

/**
 * 📦 LIST ENDPOINT
 */
opportunitiesRouter.get("/list", async (c) => {
  return c.json({
    success: true,
    data: [],
  });
});