import { initTRPC } from "@trpc/server";
import superjson from "superjson";

/**
 * tRPC Middleware — Public Access (No Auth)
 * ============================================================================
 * Todos los endpoints son públicos.
 * El sistema usa identificación por API key interna, no OAuth.
 */

const t = initTRPC.create({
  transformer: superjson,
});

export const createTRPCContext = () => ({});

export const router = t.router;
export const publicProcedure = t.procedure;

// Kept for backward compatibility — now same as publicProcedure
export const authedProcedure = t.procedure;
export const adminProcedure = t.procedure;
