import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ============================================================================
// USUARIOS (Auth + perfil de licitaciones)
// ============================================================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin", "licitador"]).default("user").notNull(),
  alertasEmail: boolean("alertas_email").default(true),
  alertasWhatsApp: boolean("alertas_whatsapp").default(false),
  umbralScore: int("umbral_score").default(80),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// OPORTUNIDADES (datos crudos de Mercado Publico)
// ============================================================================
export const opportunities = mysqlTable("opportunities", {
  id: serial("id").primaryKey(),
  mpId: varchar("mp_id", { length: 50 }).notNull().unique(),
  codigo: varchar("codigo", { length: 50 }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  organismo: varchar("organismo", { length: 200 }),
  region: varchar("region", { length: 50 }),
  comuna: varchar("comuna", { length: 100 }),
  montoEstimado: decimal("monto_estimado", { precision: 15, scale: 2 }),
  moneda: varchar("moneda", { length: 10 }).default("CLP"),
  fechaPublicacion: timestamp("fecha_publicacion"),
  fechaCierre: timestamp("fecha_cierre"),
  estado: mysqlEnum("estado", ["Publicada", "Cerrada", "Adjudicada", "Desierta"]).default("Publicada"),
  categoriaMp: varchar("categoria_mp", { length: 100 }),
  rawData: json("raw_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = typeof opportunities.$inferInsert;

// ============================================================================
// MATCHES (filtradas por IA para D&G)
// ============================================================================
export const matches = mysqlTable("matches", {
  id: serial("id").primaryKey(),
  opportunityId: int("opportunity_id").notNull(),
  score: int("score").notNull(),
  categoriaDg: mysqlEnum("categoria_dg", ["CONSTRUCCION", "HVAC", "MONTAJE", "MULTISERVICIO"]).notNull(),
  subcategoria: varchar("subcategoria", { length: 50 }),
  keywordsMatched: json("keywords_matched"),
  estado: mysqlEnum("match_estado", ["review", "confirmed", "discarded", "postulating", "won", "lost"]).default("review"),
  prioridad: mysqlEnum("prioridad", ["alta", "media", "baja"]).default("media"),
  notas: text("notas"),
  assignedTo: int("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

// ============================================================================
// PROYECTOS D&G (fichas de proyectos ejecutados)
// ============================================================================
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  codigo: varchar("codigo", { length: 50 }),
  mandante: varchar("mandante", { length: 200 }),
  region: varchar("region", { length: 50 }),
  comuna: varchar("comuna", { length: 100 }),
  montoContrato: decimal("monto_contrato", { precision: 15, scale: 2 }),
  m2Intervenidos: decimal("m2_intervenidos", { precision: 10, scale: 2 }),
  plazoMeses: int("plazo_meses"),
  trabajadores: int("trabajadores"),
  accidentes: int("accidentes").default(0),
  andamiosM3: int("andamios_m3"),
  especialidad: mysqlEnum("especialidad", ["CONSTRUCCION", "HVAC", "MONTAJE"]),
  estadoProyecto: mysqlEnum("estado_proyecto", ["finalizado", "ejecucion", "licitacion", "postulado"]).default("finalizado"),
  fechaInicio: timestamp("fecha_inicio"),
  fechaEntrega: timestamp("fecha_entrega"),
  descripcionTecnica: text("descripcion_tecnica"),
  fotos: json("fotos"),
  tags: json("tags"),
  isDestacado: boolean("is_destacado").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ============================================================================
// ALERTAS (notificaciones enviadas a usuarios)
// ============================================================================
export const alerts = mysqlTable("alerts", {
  id: serial("id").primaryKey(),
  matchId: int("match_id").notNull(),
  userId: int("user_id").notNull(),
  canal: mysqlEnum("canal", ["email", "whatsapp", "dashboard"]).notNull(),
  estado: mysqlEnum("alert_estado", ["sent", "read", "clicked"]).default("sent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;
