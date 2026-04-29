import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { opportunityRouter } from "./opportunities/router";
import { matchRouter } from "./matches/router";
import { projectRouter } from "./projects/router";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  opportunity: opportunityRouter,
  match: matchRouter,
  project: projectRouter,
});

export type AppRouter = typeof appRouter;
