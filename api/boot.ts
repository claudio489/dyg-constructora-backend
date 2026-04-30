import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono<{ Bindings: HttpBindings }>();

// CORS for cross-domain frontend (Netlify → Render)
app.use(cors({
  origin: (origin) => {
    // Allow any Netlify app + custom domains
    if (!origin) return "*";
    if (/\.netlify\.app$/.test(origin)) return origin;
    if (origin.includes("dygconstructora.cl")) return origin;
    if (origin.includes("localhost")) return origin;
    return "https://dygconstructora.cl";
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// tRPC API routes
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

// Health check
app.get("/ping", (c) =>
  c.json({
    ok: true,
    service: "dyg-licitaciones-backend",
    version: "2.0.0",
    ts: new Date().toISOString(),
    features: ["scraper", "normalizer", "ai-analyzer", "match-engine", "opportunities-api"],
  })
);

// 404 for unmatched API routes
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (process.env.NODE_ENV === "production") {
  const { serve } = await import("@hono/node-server");
  const port = parseInt(process.env.PORT || "10000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`[DYG-Licitaciones] Server running on port ${port}`);
    console.log(`[DYG-Licitaciones] Health check: http://localhost:${port}/ping`);
  });
}
