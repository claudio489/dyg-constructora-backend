import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { setCookie } from "hono/cookie";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { createOAuthCallbackHandler, exchangeCodeForSession } from "./kimi/auth";
import { getSessionCookieOptions } from "./lib/cookies";
import { Session } from "@contracts/constants";
import { Paths } from "@contracts/constants";

const app = new Hono<{ Bindings: HttpBindings }>();

// CORS for cross-domain frontend (Netlify → Render)
// Allow any Netlify preview URL + your custom domain
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
// Uses the frontend URL as redirect_uri (must match Kimi portal registration)
app.get("/api/oauth/authorize", (c) => {
  const appID = env.appId;
  const kimiAuthUrl = env.kimiAuthUrl;
  const frontendUrl = c.req.query("redirect_uri") || env.kimiOpenUrl;
  const state = Buffer.from(frontendUrl).toString('base64');

  // Use the frontend URL as the callback — this MUST match what's registered in Kimi portal
  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", frontendUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return c.redirect(url.toString(), 302);
});

// OAuth exchange endpoint — frontend sends code here after Kimi redirects back
app.post("/api/oauth/exchange", async (c) => {
  try {
    const { code, state } = await c.req.json();
    if (!code || !state) {
      return c.json({ error: "code and state are required" }, 400);
    }

    const frontendUrl = Buffer.from(state, 'base64').toString('utf8');
    // Must use the SAME redirect_uri that was used for authorization (Kimi portal registered URL)
    const result = await exchangeCodeForSession(code, frontendUrl, c.req.raw.headers);

    const cookieOpts = getSessionCookieOptions(c.req.raw.headers);
    setCookie(c, Session.cookieName, result.token, {
      ...cookieOpts,
      maxAge: Session.maxAgeMs / 1000,
    });

    return c.json({ success: true, redirect: frontendUrl });
  } catch (error) {
    console.error("[OAuth] Exchange failed", error);
    return c.json({ error: "OAuth exchange failed" }, 500);
  }
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
