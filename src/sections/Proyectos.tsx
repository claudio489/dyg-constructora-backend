import { useState } from 'react';
import { HardHat, Thermometer, Wrench, ExternalLink, MapPin, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

// ============================================================
// SISTEMA DE FICHAS DE PROYECTO - D&G CONSTRUCTORA SPA
// ============================================================
// Niveles de ficha:
//   A (destacado) → proyectos >$100M o estratégicos
//   B (estándar)  → proyectos $20M-$100M
//   C (compacto)  → proyectos <$20M o HVAC residencial
//
// Para agregar un nuevo proyecto, completar la interfaz Project
// y agregar al array projects. El sistema determina el nivel
// automáticamente por monto.
// ============================================================

export type ProjectLevel = 'A' | 'B' | 'C';
export type Specialty = 'CONSTRUCCION' | 'HVAC' | 'MONTAJE';
export type ProjectStatus = 'finalizado' | 'ejecucion' | 'licitacion';

export interface Project {
  id: number;
  slug: string;
  nombre: string;
  cliente: string;
  comuna: string;
  region?: string;
  especialidad: Specialty;
  monto: number; // en pesos chilenos (número, sin formato)
  montoStr: string; // string formateado para display
  superficie: string | null; // "7.861 m²", "90.000 BTU", "485 m³"
  idLicitacion: string | null; // código del contrato
  plazo: string | null; // "Marzo - Julio 2021"
  estado: ProjectStatus;
  descripcion: string;
  destacado: boolean; // true = forzar nivel A
  imagen: string; // ruta imagen principal
  imagenesExtra?: string[]; // rutas imágenes adicionales (máx 2)
  tagline?: string; // "Infraestructura Educativa · Los Ángeles"
}

// ============================================================
// ARRAY DE PROYECTOS - Todos los proyectos del deck comercial
// ============================================================
// INSTRUCCIONES para agregar un nuevo proyecto:
// 1. Elegir el nivel (A/B/C) según monto, o marcar destacado=true
// 2. Nombrar imagen: /proyectos/[slug].webp
// 3. Completar todos los campos obligatorios según nivel
// 4. Agregar al final de este array
// ============================================================

export const projects: Project[] = [
  // ═══════════════════════════════════════════════════════════
  // NIVEL A — Destacados (>$100M o estratégicos)
  // ═══════════════════════════════════════════════════════════
  {
    id: 1, slug: "escuela-el-nogal", nombre: "Conservación Escuela El Nogal",
    cliente: "MINEDUC", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 449990032, montoStr: "$449.990.032",
    superficie: "7.861 m²", idLicitacion: "2409-1036-LR23", plazo: "Septiembre 2025",
    estado: "finalizado",
    descripcion: "Conservación integral de escuela con obra civil completa. Uno de los proyectos más significativos en infraestructura educativa de la región del Biobío.",
    destacado: true, imagen: "/proyectos/escuela-el-nogal.webp",
    tagline: "Infraestructura Educativa · Los Ángeles",
  },
  {
    id: 2, slug: "escuela-loncopangue", nombre: "Escuela G-1091 Loncopangue",
    cliente: "MINEDUC", comuna: "Quilaco", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 293111930, montoStr: "$293.111.930",
    superficie: "3.832 m²", idLicitacion: "3802-9-LQ22", plazo: "Febrero - Agosto 2023",
    estado: "finalizado",
    descripcion: "Conservación y mejoramiento de infraestructura educativa en sector rural. Intervención completa en 552 ml de perímetro.",
    destacado: true, imagen: "/proyectos/escuela-loncopangue.webp",
    tagline: "Escuela G-1091 · Loncopangue, Quilaco",
  },
  {
    id: 3, slug: "escuela-teodosio", nombre: "Escuela Teodosio Urrutia - Pidima",
    cliente: "MINEDUC", comuna: "Ercilla", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 299999969, montoStr: "$299.999.969",
    superficie: "465,8 m²", idLicitacion: "4306-3-LQ21", plazo: "Mayo 2021 - Enero 2022",
    estado: "finalizado",
    descripcion: "Conservación térmica con instalación sistema EIFS y climatización split de muro. 230 m³ andamios multidireccionales certificados.",
    destacado: true, imagen: "/proyectos/escuela-teodosio.webp",
    tagline: "Conservación Térmica · Ercilla",
  },
  {
    id: 4, slug: "montaje-silos-inobi", nombre: "Montaje Industrial de Silos - INOBI",
    cliente: "INOBI SpA", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "MONTAJE", monto: 430000000, montoStr: "$430.000.000",
    superficie: "485 m³", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Ensamblaje estructural completo: recepción, verificación, izaje controlado, montaje por etapas de virolas, alineación, aplome, pernos de alta resistencia con torque controlado.",
    destacado: true, imagen: "/proyectos/montaje-silos.webp",
    tagline: "Montaje Industrial · INOBI SpA",
  },
  {
    id: 6, slug: "municipalidad-ercilla", nombre: "Municipalidad de Ercilla (Ex-Internado)",
    cliente: "Municipalidad de Ercilla", comuna: "Ercilla", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 248350652, montoStr: "$248.350.652",
    superficie: "610 m²", idLicitacion: "4306-3-LQ21", plazo: "Marzo - Julio 2021",
    estado: "finalizado",
    descripcion: "Remodelación integral del internado para edificio consistorial municipal. EMA 2020 habilitación. Instalación de áreas climatizadas en sistemas split.",
    destacado: true, imagen: "/proyectos/internado-ercilla.webp",
    tagline: "Remodelación · Municipalidad de Ercilla",
  },
  {
    id: 9, slug: "viviendas-sociales", nombre: "Mano de Obra Viviendas Sociales - INOBI",
    cliente: "INOBI SpA", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "MONTAJE", monto: 250000000, montoStr: "$250.000.000",
    superficie: "305 m³", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Provisión y gestión de mano de obra especializada. Cuadrillas calificadas para obras preliminares, obra gruesa, estructuras, tabiquería, instalaciones y terminaciones.",
    destacado: false, imagen: "/proyectos/viviendas-sociales.webp",
    tagline: "Viviendas Sociales · INOBI SpA",
  },

  // ═══════════════════════════════════════════════════════════
  // NIVEL B — Estándar ($20M-$100M)
  // ═══════════════════════════════════════════════════════════
  {
    id: 5, slug: "sede-san-ramon", nombre: "Sede Comunitaria San Ramón - Rucalhue",
    cliente: "Municipalidad", comuna: "Rucalhue", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 69956456, montoStr: "$69.956.456",
    superficie: "610 m²", idLicitacion: "3801-19-LP22", plazo: null,
    estado: "finalizado",
    descripcion: "Construcción de sede comunitaria para servicios locales. Estructura completa con instalaciones y terminaciones.",
    destacado: false, imagen: "/proyectos/sede-san-ramon.webp",
  },
  {
    id: 7, slug: "plazas-heroes-hualqui", nombre: "Plazas Héroes de Chile y Rinconada - Hualqui",
    cliente: "Municipalidad", comuna: "Hualqui", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 99831358, montoStr: "$99.831.358",
    superficie: "3.000 m²", idLicitacion: "5502-14-LP23", plazo: null,
    estado: "finalizado",
    descripcion: "Construcción y mejoramiento de plazas públicas en sector urbano de Hualqui. Mobiliario urbano, iluminación y áreas verdes.",
    destacado: false, imagen: "/proyectos/plaza-heroes-hualqui.webp",
  },
  {
    id: 8, slug: "plaza-peaje", nombre: "Plaza de Peaje Santa Clara y Maicas",
    cliente: "CRCC", comuna: "Santa Clara", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 93917536, montoStr: "$93.917.536",
    superficie: "2.500 m²", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Construcción de plazas de peaje para concesionaria CRCC. Estructuras, instalaciones eléctricas, sistemas de control y terminaciones.",
    destacado: false, imagen: "/proyectos/plaza-peaje.webp",
  },
  {
    id: 10, slug: "cesfam-quilaco", nombre: "CESFAM Quilaco + Farmacia",
    cliente: "MINSAL", comuna: "Quilaco", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 10000000, montoStr: "$10.000.000",
    superficie: null, idLicitacion: "3803-15-LE23", plazo: null,
    estado: "finalizado",
    descripcion: "Ampliación bodega farmacia CESFAM Quilaco. Proyecto de salud pública para mejorar infraestructura de atención primaria.",
    destacado: false, imagen: "/proyectos/cesfam-quilaco.webp",
  },
  {
    id: 11, slug: "cesfam-antuco", nombre: "CESFAM Antuco + PSR Los Canelos",
    cliente: "MINSAL", comuna: "Antuco", region: "Biobío",
    especialidad: "HVAC", monto: 116125674, montoStr: "$116.125.674",
    superficie: "1.138 m²", idLicitacion: "1057960-24-SE21", plazo: null,
    estado: "finalizado",
    descripcion: "Climatización integral CESFAM con split inverter. Sistema HVAC completo para centro de salud familiar.",
    destacado: false, imagen: "/proyectos/cesfam-antuco.webp",
  },
  {
    id: 12, slug: "cmpc-laja-lab", nombre: "Lab Sala Fibra - CMPC Pulp Laja",
    cliente: "CMPC", comuna: "Laja", region: "Biobío",
    especialidad: "HVAC", monto: 101150000, montoStr: "$101.150.000",
    superficie: null, idLicitacion: null, plazo: "160 días",
    estado: "finalizado",
    descripcion: "Climatización y ventilación de laboratorio de fibra. SAP: 133764.",
    destacado: true, imagen: "/proyectos/cmpc-laja.webp",
  },
  {
    id: 13, slug: "hospital-angeles", nombre: "Hospital de Los Ángeles",
    cliente: "MINSAL", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "HVAC", monto: 50000000, montoStr: "$50.000.000",
    superficie: "90.000 BTU", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Instalación climatización hospital: split muro, piso cielo y ducto. Sistema de alta capacidad para sector salud.",
    destacado: false, imagen: "/proyectos/hospital-angeles.webp",
  },
  {
    id: 18, slug: "brigada-conaf", nombre: "Brigada CONAF / Forestal Yumbel",
    cliente: "CONAF", comuna: "Yumbel", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 19681420, montoStr: "$19.681.420",
    superficie: "127 m²", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Infraestructura para brigada de incendios forestales. 178 m³ andamios certificados.",
    destacado: false, imagen: "/proyectos/brigada-conaf.webp",
  },
  {
    id: 19, slug: "servicio-salud", nombre: "Servicio Salud Biobío",
    cliente: "SSBB", comuna: "Concepción", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 19515395, montoStr: "$19.515.395",
    superficie: null, idLicitacion: "1057414-5-LE25", plazo: "Mayo-Junio 2025",
    estado: "finalizado",
    descripcion: "Sala multiuso para Servicio Salud Biobío. Ejecución Mayo-Junio 2025.",
    destacado: false, imagen: "/proyectos/servicio-salud-biobio.webp",
  },
  {
    id: 21, slug: "galpon-nacimiento", nombre: "Galpón Nacimiento / CECOSF",
    cliente: "Privado", comuna: "Nacimiento", region: "Biobío",
    especialidad: "CONSTRUCCION", monto: 15000000, montoStr: "$15.000.000",
    superficie: null, idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Infraestructura industrial y CECOSF en Nacimiento. Sector comercial.",
    destacado: false, imagen: "/proyectos/galpon-nacimiento.webp",
  },

  // ═══════════════════════════════════════════════════════════
  // NIVEL C — Compacto (<$20M, HVAC residencial)
  // ═══════════════════════════════════════════════════════════
  {
    id: 14, slug: "hacienda-san-lorenzo", nombre: "Hacienda San Lorenzo",
    cliente: "Privado", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "HVAC", monto: 48768245, montoStr: "$48.768.245",
    superficie: "60K+48K+18K BTU", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Instalación sistemas piso cielo + inverter. Proyecto residencial de alta gama.",
    destacado: false, imagen: "/proyectos/hacienda-san-lorenzo.webp",
  },
  {
    id: 15, slug: "prodalam", nombre: "Prodalam - Los Ángeles",
    cliente: "Prodalam", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "HVAC", monto: 27000000, montoStr: "$27.000.000",
    superficie: null, idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "Split industrial para áreas administrativas y operativas. Optimización de eficiencia energética.",
    destacado: false, imagen: "/proyectos/prodalam.webp",
  },
  {
    id: 16, slug: "mall-chino", nombre: "Mall Chino - Los Ángeles",
    cliente: "Privado", comuna: "Los Ángeles", region: "Biobío",
    especialidad: "HVAC", monto: 20000000, montoStr: "$20.000.000",
    superficie: "60.000 BTU", idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "60.000 BTU ANWO para centro comercial. Sistema de climatización continua.",
    destacado: false, imagen: "/proyectos/mall-chino.webp",
  },
  {
    id: 17, slug: "clinica-dental", nombre: "Clínica Dental DIB / Rucairqui",
    cliente: "Privado", comuna: "Puerto Saavedra", region: "Biobío",
    especialidad: "HVAC", monto: 18000100, montoStr: "$18.000.100",
    superficie: null, idLicitacion: null, plazo: null,
    estado: "finalizado",
    descripcion: "HVAC completo centralizado con control automatizado. Especializado para clínica dental.",
    destacado: false, imagen: "/proyectos/clinica-dental.webp",
  },
  {
    id: 20, slug: "oficina-sgsso", nombre: "Oficina SGSSO - CMPC",
    cliente: "CMPC", comuna: "Nacimiento", region: "Biobío",
    especialidad: "HVAC", monto: 4858200, montoStr: "$4.858.200",
    superficie: null, idLicitacion: "SAP: 133764", plazo: "Mayo 2025",
    estado: "finalizado",
    descripcion: "Remodelación oficina SGSSO CMPC Nacimiento.",
    destacado: false, imagen: "/proyectos/oficina-sgsso.webp",
  },
];

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

export function getProjectLevel(p: Project): ProjectLevel {
  if (p.destacado) return 'A';
  if (p.monto >= 20000000) return 'B';
  return 'C';
}

export function formatMonto(monto: number): string {
  if (monto >= 1000000000) return `$${(monto / 1000000000).toFixed(1).replace(/\.0$/, '')}MM`;
  if (monto >= 1000000) return `$${(monto / 1000000).toFixed(0)}M`;
  return `$${monto.toLocaleString('es-CL')}`;
}

const filters = [
  { key: 'ALL', label: 'Todos' },
  { key: 'CONSTRUCCION', label: 'Construcción', icon: HardHat },
  { key: 'HVAC', label: 'Climatización', icon: Thermometer },
  { key: 'MONTAJE', label: 'Montaje', icon: Wrench },
] as const;

type FilterKey = typeof filters[number]['key'];

// ============================================================
// GALERÍA LIGHTBOX (para fichas nivel A con múltiples fotos)
// ============================================================

function ImageGallery({ images, title, onClose }: { images: string[]; title: string; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0f1a]/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-gray-400 hover:text-white">
          <X className="w-8 h-8" />
        </button>
        <img src={images[current]} alt={`${title} - ${current + 1}`}
          className="w-full max-h-[70vh] object-contain rounded-xl" />
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button onClick={() => setCurrent(c => (c - 1 + images.length) % images.length)}
              className="p-2 rounded-full bg-[#1f2937] text-white hover:bg-[#374151]">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-400">{current + 1} / {images.length}</span>
            <button onClick={() => setCurrent(c => (c + 1) % images.length)}
              className="p-2 rounded-full bg-[#1f2937] text-white hover:bg-[#374151]">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: PROJECT CARD (reutilizable, 3 niveles)
// ============================================================

function ProjectCard({ project }: { project: Project }) {
  const level = getProjectLevel(project);
  const [showGallery, setShowGallery] = useState(false);
  const allImages = [project.imagen, ...(project.imagenesExtra || [])].filter(Boolean);

  const specialtyColors = {
    CONSTRUCCION: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    HVAC: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    MONTAJE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  const estadoLabel = {
    finalizado: 'Finalizado',
    ejecucion: 'En ejecución',
    licitacion: 'En licitación',
  };

  // ─── NIVEL A (Destacado) ───
  if (level === 'A') {
    return (
      <div className="card-dg overflow-hidden group hover:border-amber-500/30 transition-all lg:col-span-1">
        {/* Imagen principal */}
        <div className="h-52 overflow-hidden relative">
          <img src={project.imagen} alt={project.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0f1a] to-transparent h-20" />
          <div className="absolute top-3 right-3 text-xs bg-amber-500/15 text-amber-400 px-2 py-1 rounded-full font-medium backdrop-blur-sm border border-amber-500/30">
            Destacado
          </div>
          {allImages.length > 1 && (
            <button onClick={() => setShowGallery(true)}
              className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-[#0a0f1a]/60 text-white hover:bg-amber-500/20 hover:text-amber-400 transition-all">
              <ZoomIn className="w-4 h-4" />
            </button>
          )}
          {project.tagline && (
            <div className="absolute bottom-3 left-3 text-xs text-gray-400 font-medium">
              {project.tagline}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full border ${specialtyColors[project.especialidad]}`}>
              {project.especialidad}
            </span>
            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
              {estadoLabel[project.estado]}
            </span>
          </div>

          <h3 className="font-bold text-white text-base mb-2 leading-tight">{project.nombre}</h3>

          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{project.cliente} · {project.comuna}
          </p>

          {/* Tags/Indicadores */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.superficie && (
              <span className="text-xs bg-[#1f2937] text-gray-400 px-2 py-1 rounded">📐 {project.superficie}</span>
            )}
            {project.idLicitacion && (
              <span className="text-xs bg-[#1f2937] text-gray-400 px-2 py-1 rounded">🆔 {project.idLicitacion}</span>
            )}
            {project.plazo && (
              <span className="text-xs bg-[#1f2937] text-gray-400 px-2 py-1 rounded">📅 {project.plazo}</span>
            )}
          </div>

          <p className="text-sm text-gray-400 mb-4 leading-relaxed">{project.descripcion}</p>

          <div className="flex items-center justify-between pt-2 border-t border-[#1f2937]">
            <span className="text-xl font-black gradient-gold-text">{formatMonto(project.monto)}</span>
          </div>
        </div>

        {showGallery && <ImageGallery images={allImages} title={project.nombre} onClose={() => setShowGallery(false)} />}
      </div>
    );
  }

  // ─── NIVEL B (Estándar) ───
  if (level === 'B') {
    return (
      <div className="card-dg overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="h-40 overflow-hidden relative">
          <img src={project.imagen} alt={project.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0f1a] to-transparent h-16" />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full border ${specialtyColors[project.especialidad]}`}>
              {project.especialidad}
            </span>
            <span className="text-xs bg-green-500/15 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
              {estadoLabel[project.estado]}
            </span>
          </div>
          <h3 className="font-bold text-white text-sm mb-1 leading-tight">{project.nombre}</h3>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <MapPin className="w-3 h-3" />{project.cliente} · {project.comuna}
          </p>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{project.descripcion}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-black gradient-gold-text">{formatMonto(project.monto)}</span>
            {project.superficie && <span className="text-xs text-gray-500">{project.superficie}</span>}
          </div>
        </div>
      </div>
    );
  }

  // ─── NIVEL C (Compacto) ───
  return (
    <div className="card-dg overflow-hidden group hover:border-amber-500/30 transition-all">
      <div className="h-32 overflow-hidden relative">
        <img src={project.imagen} alt={project.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0f1a] to-transparent h-12" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${specialtyColors[project.especialidad]}`}>
            {project.especialidad}
          </span>
        </div>
        <h3 className="font-bold text-white text-sm mb-1 leading-tight">{project.nombre}</h3>
        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          <MapPin className="w-3 h-3" />{project.cliente}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-base font-black gradient-gold-text">{formatMonto(project.monto)}</span>
          {project.superficie && <span className="text-[10px] text-gray-500">{project.superficie}</span>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SECCIÓN PRINCIPAL: PORTAFOLIO DE PROYECTOS
// ============================================================

export default function Proyectos() {
  const [filter, setFilter] = useState<FilterKey>('ALL');
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.especialidad === filter);

  // Separar por nivel para layout
  const destacados = filtered.filter(p => getProjectLevel(p) === 'A');
  const estandares = filtered.filter(p => getProjectLevel(p) === 'B');
  const compactos = filtered.filter(p => getProjectLevel(p) === 'C');

  return (
    <section id="proyectos" className="section-padding py-20 bg-[#070b14]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <ExternalLink className="w-4 h-4" />
            Portafolio Completo
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Proyectos <span className="gradient-gold-text">Ejecutados</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {projects.length} proyectos finalizados para MINEDUC, MINSAL, CMPC, CONAF, municipalidades y clientes privados.
            Todos con sello 100% finalizado.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { num: String(projects.length), label: 'Proyectos Finalizados' },
            { num: '60.000+', label: 'm² Construidos' },
            { num: '$2.200M+', label: 'Facturación Total' },
            { num: '8+', label: 'Años Experiencia' },
          ].map((s, i) => (
            <div key={i} className="card-dg py-4 text-center">
              <span className="text-2xl font-black gradient-gold-text">{s.num}</span>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                filter === f.key ? 'bg-amber-500/15 text-amber-400 border-amber-500' : 'bg-[#111827] text-gray-400 border-[#1f2937] hover:border-gray-600'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* ═══ NIVEL A: Destacados (3 cols, cards grandes) ═══ */}
        {destacados.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Proyectos Destacados
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destacados.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        {/* ═══ NIVEL B: Estándar (3 cols, cards medianas) ═══ */}
        {estandares.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Proyectos Estándar
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {estandares.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        {/* ═══ NIVEL C: Compactos (3 cols, cards pequeñas) ═══ */}
        {compactos.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gray-500" />
              Proyectos HVAC Residencial y Comercial
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compactos.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}

        {/* Sin resultados */}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No hay proyectos en esta categoría.
          </div>
        )}
      </div>
    </section>
  );
}
