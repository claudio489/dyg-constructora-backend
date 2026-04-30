import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono<{ Bindings: HttpBindings }>();

/**
 * 🚨 CORS FIX REAL (tRPC + credentials compatible)
 */
app.use(
  cors({
    origin: (origin) => {
      const allowed = [
        "https://voluble-brioche-70156f.netlify.app",
        "https://dygconstructora.cl",
        "http://localhost:5173",
      ];

      if (!origin) return null;
      if (allowed.includes(origin)) return origin;

      if (origin.endsWith(".netlify.app")) return origin;

      return allowed[0];
    },
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

/**
 * 🧠 tRPC (PIPELINE LICITACIONES)
 */
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

/**
 * ❤️ HEALTH CHECK
 */
app.get("/ping", (c) =>
  c.json({
    ok: true,
    service: "dyg-licitaciones-backend",
    version: "2.1.0",
    ts: new Date().toISOString(),
  })
);

/**
 * ❌ API fallback (IMPORTANTE)
 */
app.all("/api/*", (c) => {
  return c.json(
    {
      error: "Not Found",
      path: c.req.path,
    },
    404
  );
});

export default app;

/**
 * 🚀 SERVER (Render)
 */
if (process.env.NODE_ENV === "production") {
  const { serve } = await import("@hono/node-server");
  const port = Number(process.env.PORT || 10000);

  serve(
    {
      fetch: app.fetch,
      port,
    },
    () => {
      console.log(`[DYG] Backend running on ${port}`);
    }
  );
}