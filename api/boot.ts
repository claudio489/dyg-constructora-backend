import { Hono } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";

import { scrapeLicitaciones } from "./scraper/engine";
import { normalizeLicitaciones } from "./services/normalizer";

const app = new Hono();

// =========================
// CORS FIX REAL (SIN TRPC)
// =========================
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*";

      const allowed = [
        "https://dygconstructora.cl",
        "https://www.dygconstructora.cl",
      ];

      if (allowed.includes(origin)) return origin;
      if (origin.includes("netlify.app")) return origin;
      if (origin.includes("localhost")) return origin;

      return "https://dygconstructora.cl";
    },
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// =========================
// HEALTH
// =========================
app.get("/ping", (c) => {
  return c.json({
    ok: true,
    service: "dyg-licitaciones-backend",
    version: "3.1.0",
    ts: new Date().toISOString(),
  });
});

// =========================
// PIPELINE REAL
// =========================
app.post("/api/opportunities/generate", async (c) => {
  try {
    const raw = await scrapeLicitaciones();

    const normalized = normalizeLicitaciones(raw);

    return c.json({
      success: true,
      count: normalized.length,
      data: normalized,
    });
  } catch (err: any) {
    return c.json(
      {
        success: false,
        error: err?.message || "pipeline error",
      },
      500
    );
  }
});

// =========================
// 404
// =========================
app.all("*", (c) => {
  return c.json({ error: "Not Found" }, 404);
});

export default app;

// =========================
// SERVER RENDER
// =========================
if (process.env.NODE_ENV === "production") {
  const { serve } = await import("@hono/node-server");

  const port = Number(process.env.PORT || 10000);

  serve({
    fetch: app.fetch,
    port,
  });

  console.log(`[DYG] running on ${port}`);
}