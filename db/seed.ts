import { getDb } from "../api/queries/connection";
import { projects } from "./schema";

const db = getDb();

async function seed() {
  console.log("Seeding D&G projects...");

  const existing = await db.select({ count: sql<number>`count(*)` }).from(projects);
  if (existing[0]?.count > 0) {
    console.log("Projects already seeded, skipping.");
    return;
  }

  const seedProjects = [
    {
      slug: "escuela-el-nogal",
      nombre: "Conservación Escuela El Nogal - Los Ángeles",
      codigo: "2409-1036-LR23",
      mandante: "MINEDUC",
      region: "Biobío",
      comuna: "Los Ángeles",
      montoContrato: "449990032",
      m2Intervenidos: "7861",
      plazoMeses: 12,
      trabajadores: 18,
      accidentes: 0,
      andamiosM3: 350,
      especialidad: "CONSTRUCCION" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Conservación integral de escuela con obra civil completa. Incluye reparación de cubierta, muros, pavimentos, instalaciones sanitarias y eléctricas, pintura, cierres y terminaciones.",
      fotos: JSON.stringify(["imagenes/escuela_elnogal.webp", "imagenes/escuela_elnogal_2.webp", "imagenes/escuela_elnogal_3.webp"]),
      tags: JSON.stringify(["escuela", "conservación", "obra_gruesa", "instalaciones", "terminaciones"]),
      isDestacado: true,
    },
    {
      slug: "montaje-silos-inobi",
      nombre: "Montaje Industrial de Silos - INOBI SpA",
      codigo: "INOBI-SILOS-2024",
      mandante: "INOBI SpA",
      region: "Biobío",
      comuna: "Los Ángeles",
      montoContrato: "430000000",
      m2Intervenidos: null,
      plazoMeses: 8,
      trabajadores: 12,
      accidentes: 0,
      andamiosM3: 485,
      especialidad: "MONTAJE" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Ensamblaje estructural completo de silos: recepción, verificación, izaje controlado, montaje por etapas de virolas, alineación, aplome, pernos de alta resistencia con torque controlado.",
      fotos: JSON.stringify(["imagenes/silos_inobi.webp", "imagenes/silos_inobi_2.webp"]),
      tags: JSON.stringify(["silos", "montaje_industrial", "estructuras_metalicas", "torque_controlado"]),
      isDestacado: true,
    },
    {
      slug: "municipalidad-ercilla",
      nombre: "Municipalidad de Ercilla (Ex-Internado)",
      codigo: "4306-3-LQ21",
      mandante: "Municipalidad de Ercilla",
      region: "Biobío",
      comuna: "Ercilla",
      montoContrato: "248350652",
      m2Intervenidos: "610",
      plazoMeses: 5,
      trabajadores: 8,
      accidentes: 0,
      andamiosM3: 230,
      especialidad: "CONSTRUCCION" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Remodelación integral del ex-internado para transformarlo en edificio consistorial municipal. EMA 2020 habilitación. Instalación de áreas climatizadas con sistemas split.",
      fotos: JSON.stringify(["imagenes/internado_ercilla2.webp", "imagenes/internado_ercilla_2.webp"]),
      tags: JSON.stringify(["remodelación", "climatización", "instalaciones", "municipalidad"]),
      isDestacado: true,
    },
    {
      slug: "cesfam-antuco",
      nombre: "CESFAM Antuco + PSR Los Canelos",
      codigo: "1057960-24-SE21",
      mandante: "MINSAL",
      region: "Biobío",
      comuna: "Antuco",
      montoContrato: "116125674",
      m2Intervenidos: "1138.40",
      plazoMeses: 6,
      trabajadores: 6,
      accidentes: 0,
      andamiosM3: null,
      especialidad: "HVAC" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Climatización integral CESFAM e instalación split inverter. Intervención en 1.138,40 m2 de infraestructura de salud rural.",
      fotos: JSON.stringify(["imagenes/cesfam_antuco.webp"]),
      tags: JSON.stringify(["cesfam", "salud", "split_inverter", "climatización"]),
      isDestacado: false,
    },
    {
      slug: "cmpc-laja-lab",
      nombre: "Lab Sala Fibra - CMPC Pulp Laja",
      codigo: "SAP-133764",
      mandante: "CMPC",
      region: "Biobío",
      comuna: "Laja",
      montoContrato: "101150000",
      m2Intervenidos: null,
      plazoMeses: 6,
      trabajadores: 5,
      accidentes: 0,
      andamiosM3: 180,
      especialidad: "HVAC" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Climatización y ventilación de laboratorio de fibra en Planta Laja. 160 días de ejecución. Sistemas de precisión para ambiente controlado.",
      fotos: JSON.stringify(["imagenes/cmpc_laja1.webp"]),
      tags: JSON.stringify(["cmpc", "laboratorio", "ventilación", "climatización_industrial"]),
      isDestacado: true,
    },
    {
      slug: "hospital-los-angeles",
      nombre: "Hospital de Los Ángeles - Climatización",
      codigo: "HLA-HVAC-2024",
      mandante: "MINSAL / Servicio Salud Biobío",
      region: "Biobío",
      comuna: "Los Ángeles",
      montoContrato: "50000000",
      m2Intervenidos: null,
      plazoMeses: 3,
      trabajadores: 4,
      accidentes: 0,
      andamiosM3: null,
      especialidad: "HVAC" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Instalación de sistemas HVAC de alta capacidad (90.000 BTU) con split muro, piso cielo y ducto para áreas críticas del hospital.",
      fotos: JSON.stringify(["imagenes/hospital_elei1.webp"]),
      tags: JSON.stringify(["hospital", "salud", "90k_btu", "split_muro", "piso_cielo"]),
      isDestacado: false,
    },
    {
      slug: "plaza-heroes-hualqui",
      nombre: "Plazas Héroes de Chile 3 y Rinconada 1 - Hualqui",
      codigo: "5502-14-LP23",
      mandante: "Municipalidad de Hualqui",
      region: "Biobío",
      comuna: "Hualqui",
      montoContrato: "99831358",
      m2Intervenidos: "3000",
      plazoMeses: 4,
      trabajadores: 10,
      accidentes: 0,
      andamiosM3: null,
      especialidad: "CONSTRUCCION" as const,
      estadoProyecto: "finalizado" as const,
      descripcionTecnica: "Construcción y mejoramiento de plazas públicas en sector urbano de Hualqui. Mobiliario urbano, iluminación y áreas verdes.",
      fotos: JSON.stringify(["imagenes/plaza_heroes_hualqui.webp"]),
      tags: JSON.stringify(["plaza", "infraestructura_urbana", "mobiliario", "iluminación"]),
      isDestacado: false,
    },
  ];

  for (const p of seedProjects) {
    await db.insert(projects).values(p);
  }

  console.log(`Seeded ${seedProjects.length} projects.`);
}

import { sql } from "drizzle-orm";
seed().catch(console.error);
