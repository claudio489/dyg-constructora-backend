import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler } from "./kimi/auth";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

// CORS for cross-domain frontend (Netlify → Render)
app.use(cors({
  origin: env.isProduction
    ? ["https://dygconstructora.cl", "https://www.dygconstructora.cl", /^https:\/\/.*\.netlify\.app$/]
    : "http://localhost:5173",
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// OAuth authorization endpoint — redirects to Kimi
// Backend handles the entire OAuth flow. Frontend just redirects here.
app.get("/api/oauth/authorize", (c) => {
  const appID = env.appId;
  const kimiAuthUrl = env.kimiAuthUrl;
  // Frontend URL to redirect back after successful login
  const frontendUrl = c.req.query("redirect_url") || "https://dygconstructora.cl/licitaciones";
  const state = Buffer.from(frontendUrl).toString('base64');

  // Kimi MUST redirect back to the backend callback URL
  const backendCallback = `${new URL(c.req.url).origin}/api/oauth/callback`;

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", backendCallback);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return c.redirect(url.toString(), 302);
});

app.get(Paths.oauthCallback, createOAuthCallbackHandler());

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Health check
app.get("/ping", (c) => c.json({ ok: true }));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}