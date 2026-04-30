import { z } from "zod";
import { router, publicProcedure } from "../middleware";
import { getDb } from "../queries/connection";
import { opportunities } from "../../db/schema";
import { batchClean } from "../services/scraper-cleaner";

export const scraperRouter = router({
  // ─── Clean raw data ─────────────────────────────────────────────────────
  clean: publicProcedure
    .input(z.object({
      rawData: z.array(z.object({
        CodigoExterno: z.string().optional(),
        Nombre: z.string().optional(),
        Descripcion: z.string().optional(),
        CodigoEstado: z.union([z.string(), z.number()]).optional(),
        FechaPublicacion: z.string().optional(),
        FechaCierre: z.string().optional(),
        MontoEstimado: z.number().optional(),
        Comprador: z.object({
          NombreOrganismo: z.string().optional(),
          RegionUnidad: z.string().optional(),
          ComunaUnidad: z.string().optional(),
        }).optional(),
        Tipo: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const { cleaned, report } = await batchClean(input.rawData);
      return { cleaned, report };
    }),

  // ─── Import cleaned data to DB ─────────────────────────────────────────────
  import: publicProcedure
    .input(z.object({
      records: z.array(z.object({
        codigo: z.string(),
        nombre: z.string(),
        descripcion: z.string().optional(),
        organismo: z.string().optional(),
        region: z.string().optional(),
        comuna: z.string().optional(),
        monto: z.number().nullable().optional(),
        estado: z.string().optional(),
        fechaPublicacion: z.string().nullable().optional(),
        fechaCierre: z.string().nullable().optional(),
        categoria: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      let inserted = 0;
      let skipped = 0;

      for (const rec of input.records) {
        // Check if exists
        const existing = await db.select().from(opportunities).where(eq(opportunities.mpId, rec.codigo));
        if (existing.length > 0) {
          skipped++;
          continue;
        }

        await db.insert(opportunities).values({
          mpId: rec.codigo,
          codigo: rec.codigo,
          nombre: rec.nombre,
          descripcion: rec.descripcion || null,
          organismo: rec.organismo || null,
          region: rec.region || null,
          comuna: rec.comuna || null,
          montoEstimado: rec.monto ? rec.monto.toString() : null,
          estado: (rec.estado || "Publicada") as any,
          categoriaMp: rec.categoria || null,
          fechaPublicacion: rec.fechaPublicacion ? new Date(rec.fechaPublicacion) : null,
          fechaCierre: rec.fechaCierre ? new Date(rec.fechaCierre) : null,
        });
        inserted++;
      }

      return { inserted, skipped, total: input.records.length };
    }),

  // ─── Health check ───────────────────────────────────────────────────────
  health: publicProcedure.query(() => {
    return { status: "ready", service: "scraper-cleaner" };
  }),
});
