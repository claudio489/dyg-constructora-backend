import { z } from "zod";
import { router, publicProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { projects } from "../../db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

export const projectsRouter = router({
  // Listar proyectos D&G (publico)
  list: publicProcedure
    .input(
      z.object({
        especialidad: z.enum(["CONSTRUCCION", "HVAC", "MONTAJE"]).optional(),
        estado: z.enum(["finalizado", "ejecucion", "licitacion", "postulado"]).optional(),
        destacado: z.boolean().optional(),
        mandante: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];
      
      if (input?.especialidad) filters.push(eq(projects.especialidad, input.especialidad));
      if (input?.estado) filters.push(eq(projects.estadoProyecto, input.estado));
      if (input?.destacado) filters.push(eq(projects.isDestacado, true));
      if (input?.mandante) filters.push(eq(projects.mandante, input.mandante));
      
      const where = filters.length > 0 ? and(...filters) : undefined;
      
      return await db
        .select()
        .from(projects)
        .where(where)
        .orderBy(desc(projects.createdAt))
        .limit(input?.limit || 20)
        .offset(input?.offset || 0);
    }),

  // Obtener proyecto por slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, input.slug));
      
      return result[0] || null;
    }),

  // Crear proyecto (public — no auth)
  create: publicProcedure
    .input(
      z.object({
        slug: z.string().min(3).max(100),
        nombre: z.string().min(3).max(200),
        codigo: z.string().optional(),
        mandante: z.string().optional(),
        region: z.string().optional(),
        comuna: z.string().optional(),
        montoContrato: z.string().optional(),
        m2Intervenidos: z.string().optional(),
        plazoMeses: z.number().optional(),
        trabajadores: z.number().optional(),
        accidentes: z.number().default(0),
        andamiosM3: z.number().optional(),
        especialidad: z.enum(["CONSTRUCCION", "HVAC", "MONTAJE"]).optional(),
        estadoProyecto: z.enum(["finalizado", "ejecucion", "licitacion", "postulado"]).default("finalizado"),
        fechaInicio: z.date().optional(),
        fechaEntrega: z.date().optional(),
        descripcionTecnica: z.string().optional(),
        fotos: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        isDestacado: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(projects).values({
        ...input,
        createdAt: new Date(),
      });
      
      return { id: Number(result[0].insertId), slug: input.slug };
    }),

  // Estadisticas de proyectos (publico)
  stats: publicProcedure.query(async () => {
    const db = getDb();
    const total = await db.select({ count: sql<number>`count(*)` }).from(projects);
    const construccion = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.especialidad, "CONSTRUCCION"));
    const hvac = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.especialidad, "HVAC"));
    const montaje = await db
      .select({ count: sql<number>`count(*)` })
      .from(projects)
      .where(eq(projects.especialidad, "MONTAJE"));

    return {
      total: total[0]?.count || 0,
      construccion: construccion[0]?.count || 0,
      hvac: hvac[0]?.count || 0,
      montaje: montaje[0]?.count || 0,
    };
  }),
});
