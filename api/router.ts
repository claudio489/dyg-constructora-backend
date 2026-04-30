import { router } from "./middleware";
import { opportunitiesRouter } from "./opportunities/router";
import { matchesRouter } from "./matches/router";
import { projectsRouter } from "./projects/router";

export const appRouter = router({
  opportunities: opportunitiesRouter,
  matches: matchesRouter,
  projects: projectsRouter,
});

export type AppRouter = typeof appRouter;
