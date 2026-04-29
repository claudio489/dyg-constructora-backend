import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
const db = getDb();
import { matches, opportunities } from "../../db/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export const matchRouter = createRouter({
  // Listar matches filtrados (requiere login)
  list: authedQuery
    .input(
      z.object({
        categoriaDg: z.enum(["CONSTRUCCION", "HVAC", "MONTAJE", "MULTISERVICIO"]).optional(),
        prioridad: z.enum(["alta", "media", "baja"]).optional(),
        estado: z.enum(["review", "confirmed", "discarded", "postulating", "won", "lost"]).optional(),
        minScore: z.number().min(0).max(100).optional(),
        maxScore: z.number().min(0).max(100).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const filters = [];
      
      if (input?.categoriaDg) filters.push(eq(matches.categoriaDg, input.categoriaDg));
      if (input?.prioridad) filters.push(eq(matches.prioridad, input.prioridad));
      if (input?.estado) filters.push(eq(matches.estado, input.estado));
      if (input?.minScore) filters.push(gte(matches.score, input.minScore));
      if (input?.maxScore) filters.push(lte(matches.score, input.maxScore));
      
      const where = filters.length > 0 ? and(...filters) : undefined;
      
      const results = await db
        .select({
          match: matches,
          opportunity: opportunities,
        })
        .from(matches)
        .innerJoin(opportunities, eq(matches.opportunityId, opportunities.id))
        .where(where)
        .orderBy(desc(matches.score))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
      
      return results;
    }),

  // Actualizar estado de un match
  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        estado: z.enum(["review", "confirmed", "discarded", "postulating", "won", "lost"]),
        notas: z.string().optional(),
        assignedTo: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await db
        .update(matches)
        .set({
          estado: input.estado,
          notas: input.notas,
          assignedTo: input.assignedTo,
          updatedAt: new Date(),
        })
        .where(eq(matches.id, input.id));
      
      return { success: true };
    }),

  // Favoritos del usuario (matches confirmados)
  favorites: authedQuery
    .input(z.object({ limit: z.number().default(20) }).optional())
    .query(async ({ input }) => {
      const results = await db
        .select({
          match: matches,
          opportunity: opportunities,
        })
        .from(matches)
        .innerJoin(opportunities, eq(matches.opportunityId, opportunities.id))
        .where(eq(matches.estado, "confirmed"))
        .orderBy(desc(matches.score))
        .limit(input?.limit || 20);
      
      return results;
    }),
});
