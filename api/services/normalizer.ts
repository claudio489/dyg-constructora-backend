/**
 * ============================================================================
 * DYG LICITACIONES - NORMALIZER
 * ============================================================================
 * Limpia y estandariza datos crudos de scraping.
 * Sin caracteres especiales para compatibilidad ZIP.
 */

import type { RawLicitacion } from "./engine";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CleanLicitacion {
  id: string;
  titulo: string;
  entidad: string;
  montoEstimado: number | null;
  moneda: string;
  fechaPublicacion: string | null;
  fechaCierre: string | null;
  diasHastaCierre: number | null;
  region: string;
  comuna: string;
  ubicacionNormalizada: string;
  link: string;
  estado: string;
  categoria: string;
  descripcion: string;
  palabrasClave: string[];
  calidadDatos: number;
}

export interface NormalizerReport {
  totalRecibido: number;
  totalNormalizado: number;
  duplicadosEliminados: number;
  errores: Array<{ codigo: string; razon: string }>;
}

// ─── Main Function ───────────────────────────────────────────────────────────

export function normalize(rawList: RawLicitacion[]): {
  clean: CleanLicitacion[];
  report: NormalizerReport;
} {
  const report: NormalizerReport = {
    totalRecibido: rawList.length,
    totalNormalizado: 0,
    duplicadosEliminados: 0,
    errores: [],
  };

  const seen = new Set<string>();
  const clean: CleanLicitacion[] = [];

  for (const raw of rawList) {
    try {
      if (seen.has(raw.codigo)) {
        report.duplicadosEliminados++;
        continue;
      }
      seen.add(raw.codigo);

      if (!raw.titulo || raw.titulo.length < 5) {
        report.errores.push({ codigo: raw.codigo, razon: "Titulo invalido" });
        continue;
      }

      const monto = normalizeMonto(raw.montoEstimado);
      const fechas = normalizeFechas(raw.fechaPublicacion, raw.fechaCierre);
      const region = normalizeRegion(raw.ubicacion.region);
      const comuna = normalizeComuna(raw.ubicacion.comuna);
      const keywords = extractKeywords(raw.titulo + " " + raw.descripcion);
      const calidad = calculateQuality(raw, monto, fechas.fechaCierre);

      clean.push({
        id: raw.codigo,
        titulo: sanitize(raw.titulo, 200),
        entidad: sanitize(raw.entidad, 150),
        montoEstimado: monto,
        moneda: "CLP",
        fechaPublicacion: fechas.fechaPublicacion,
        fechaCierre: fechas.fechaCierre,
        diasHastaCierre: fechas.diasHastaCierre,
        region,
        comuna,
        ubicacionNormalizada: `${comuna}, ${region}`,
        link: raw.link,
        estado: raw.estado,
        categoria: inferCategoria(raw.titulo),
        descripcion: sanitize(raw.descripcion, 500),
        palabrasClave: keywords,
        calidadDatos: calidad,
      });

      report.totalNormalizado++;
    } catch (err) {
      report.errores.push({
        codigo: raw.codigo,
        razon: err instanceof Error ? err.message : "Error desconocido",
      });
    }
  }

  return { clean, report };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function normalizeMonto(valor: number | null): number | null {
  if (valor === null || valor === undefined) return null;
  if (typeof valor !== "number") return null;
  if (valor < 0) return null;
  return Math.round(valor);
}

function normalizeFechas(pub: string | null, cierre: string | null): {
  fechaPublicacion: string | null;
  fechaCierre: string | null;
  diasHastaCierre: number | null;
} {
  const fPub = pub ? new Date(pub).toISOString() : null;
  const fCierre = cierre ? new Date(cierre).toISOString() : null;

  let dias: number | null = null;
  if (fCierre) {
    const diff = new Date(fCierre).getTime() - Date.now();
    dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return { fechaPublicacion: fPub, fechaCierre: fCierre, diasHastaCierre: dias };
}

function normalizeRegion(region: string): string {
  const map: Record<string, string> = {
    "region del biobio": "Biobio",
    "region del biobio": "Biobio",
    "viii region": "Biobio",
    "region metropolitana": "Metropolitana",
    "region de la araucania": "Araucania",
    "region de los lagos": "Los Lagos",
    "region de valparaiso": "Valparaiso",
    "region de nuble": "Nuble",
    "region del maule": "Maule",
  };

  const lower = region.toLowerCase().trim();
  return map[lower] || region || "Sin region";
}

function normalizeComuna(comuna: string): string {
  return comuna.trim() || "Sin comuna";
}

function sanitize(text: string, maxLen: number): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

function inferCategoria(titulo: string): string {
  const lower = titulo.toLowerCase();
  if (lower.includes("climatiza") || lower.includes("acondicionado") || lower.includes("hvac") || lower.includes("calefacci") || lower.includes("ventilaci"))
    return "HVAC";
  if (lower.includes("montaje") || lower.includes("silos") || lower.includes("estructura") || lower.includes("metalica") || lower.includes("industrial"))
    return "MONTAJE";
  if (lower.includes("construcci") || lower.includes("obra") || lower.includes("edificio") || lower.includes("infraestructura"))
    return "CONSTRUCCION";
  if (lower.includes("servicio") || lower.includes("mantenci") || lower.includes("reparaci"))
    return "SERVICIOS";
  return "OTROS";
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    "de", "la", "el", "en", "y", "a", "los", "del", "se", "las", "por", "un", "para", "con", "una",
    "su", "al", "lo", "pero", "sus", "le", "ya", "o", "este", "si", "porque", "esta", "entre",
    "cuando", "muy", "sin", "sobre", "tambien", "me", "hasta", "hay", "donde", "quien", "desde",
    "todo", "nos", "durante", "todos", "uno", "les", "ni", "contra", "otros", "ese", "eso", "ante",
    "ellos", "esto", "mi", "antes", "algunos", "que", "unos", "yo", "otro", "otras", "otra", "tanto",
    "esa", "estos", "mucho", "quienes", "nada", "muchos", "cual", "poco", "ella", "estar", "estas",
    "algunas", "algo", "nosotros", "mis", "tu", "te", "ti", "tus", "ellas", "nosotras", "mio", "mia",
    "mios", "mias", "tuyo", "tuya", "tuyos", "tuyas", "suyo", "suya", "suyos", "suyas", "nuestro",
    "nuestra", "nuestros", "nuestras", "esos", "esas", "estoy", "estas", "esta", "estamos", "estan",
    "estaba", "estaban", "estuvo", "estuvieron", "estuviera", "estuviesen", "estando", "estado",
    "estados", "estadas"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  const freq = new Map<string, number>();
  for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
}

function calculateQuality(raw: RawLicitacion, monto: number | null, fechaCierre: string | null): number {
  let score = 50;

  if (raw.titulo && raw.titulo.length > 10) score += 10;
  if (raw.entidad && raw.entidad.length > 3) score += 10;
  if (monto !== null && monto > 0) score += 10;
  if (fechaCierre) score += 10;
  if (raw.ubicacion.region) score += 5;
  if (raw.descripcion && raw.descripcion.length > 20) score += 5;

  return Math.min(100, score);
}
