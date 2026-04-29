import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { opportunities, matches } from "../../db/schema";
import { eq, desc, and, gte, sql, like } from "drizzle-orm";
import { fetchMercadoPublicoOpportunities, syncOpportunityStatuses } from "../scraper/mercado-publico";

export const opportunityRouter = createRouter({
  // Listar oportunidades con filtros
  list: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        estado: z.enum(["Publicada", "Cerrada", "Adjudicada", "Desierta"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];
      
      if (input?.estado) filters.push(eq(opportunities.estado, input.estado));
      if (input?.region) filters.push(like(opportunities.region, `%${input.region}%`));
      
      const where = filters.length > 0 ? and(...filters) : undefined;
      
      const results = await db
        .select()
        .from(opportunities)
        .where(where)
        .orderBy(desc(opportunities.fechaPublicacion))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
      
      return results;
    }),

  // Obtener detalle
  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(opportunities)
        .where(eq(opportunities.id, input.id));
      
      return result[0] || null;
    }),

  // Trigger scraper manual (admin)
  triggerScraper: adminQuery
    .input(
      z.object({
        ticket: z.string().optional(),
        estado: z.string().optional(),
        soloBiobio: z.boolean().default(true),
      }).optional()
    )
    .mutation(async ({ input }) => {
      const result = await fetchMercadoPublicoOpportunities({
        ticket: input?.ticket,
        estado: input?.estado,
        soloBiobio: input?.soloBiobio,
      });
      return result;
    }),

  // Sync estados (admin)
  syncStatuses: adminQuery
    .input(z.object({ ticket: z.string().optional() }).optional())
    .mutation(async ({ input }) => {
      const result = await syncOpportunityStatuses(input?.ticket);
      return result;
    }),

  // Estadisticas
  stats: publicQuery.query(async () => {
    const db = getDb();
    const total = await db.select({ count: sql<number>`count(*)` }).from(opportunities);
    const publicadas = await db.select({ count: sql<number>`count(*)` }).from(opportunities).where(eq(opportunities.estado, "Publicada"));
    const matchesCount = await db.select({ count: sql<number>`count(*)` }).from(matches);
    const altaRelevancia = await db.select({ count: sql<number>`count(*)` }).from(matches).where(gte(matches.score, 80));

    return {
      total: total[0]?.count || 0,
      publicadas: publicadas[0]?.count || 0,
      matches: matchesCount[0]?.count || 0,
      altaRelevancia: altaRelevancia[0]?.count || 0,
    };
  }),
});
