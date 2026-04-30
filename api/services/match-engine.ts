/**
 * ============================================================================
 * DYG LICITACIONES - MATCH ENGINE
 * ============================================================================
 * Compara licitaciones vs perfil empresa DYG.
 * Sin caracteres especiales para compatibilidad ZIP.
 */

import type { CleanLicitacion } from "../scraper/normalizer";

// ─── D&G Company Profile ─────────────────────────────────────────────────────

const DG_PROFILE = {
  razonSocial: "D&G Constructora SPA",
  rut: "77.123.456-K",
  especialidades: ["CONSTRUCCION", "HVAC", "MONTAJE"],
  regiones: ["Biobio", "Nuble", "Araucania"],
  comunasPrincipales: [
    "Los Angeles", "Concepcion", "Chillan", "Laja", "Nacimiento",
    "Quilaco", "Quilleco", "Yumbel", "Hualqui", "Ercilla", "Rucalhue"
  ],
  montosIdeales: { min: 10_000_000, max: 500_000_000 },
  montosMaximos: 1_000_000_000,
  experiencia: [
    "Escuelas MINEDUC (conservacion, climatizacion)",
    "CESFAM / Hospitales MINSAL (HVAC, obra civil)",
    "Laboratorios industriales (CMPC, Prodalam)",
    "Silos y estructuras metalicas",
    "Plazas y espacios publicos municipales",
    "Viviendas sociales",
  ],
  fortalezasTecnicas: [
    "Sistemas HVAC inverter y split",
    "Montaje de silos industriales",
    "Obra civil educativa y salud",
    "Andamios certificados",
    "Mano de obra especializada local",
  ],
  certificaciones: ["ISO 9001", "EMA 2020"],
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface MatchResult {
  licitacionId: string;
  titulo: string;
  matchScore: number;
  probability: "alta" | "media" | "baja" | "muy_baja";
  factors: {
    regionMatch: boolean;
    specialtyMatch: boolean;
    montoMatch: boolean;
    experienceMatch: boolean;
    tiempoMatch: boolean;
  };
  detalleAjuste: string[];
  recomendaciones: string[];
  riesgosIdentificados: string[];
}

// ─── Match Logic ───────────────────────────────────────────────────────────────

export function runMatch(lic: CleanLicitacion): MatchResult {
  const factors = {
    regionMatch: false,
    specialtyMatch: false,
    montoMatch: false,
    experienceMatch: false,
    tiempoMatch: false,
  };

  let score = 0;
  const detalle: string[] = [];
  const recomendaciones: string[] = [];
  const riesgos: string[] = [];

  // 1. Region match (25 puntos)
  const regionLower = lic.region.toLowerCase();
  if (DG_PROFILE.regiones.some((r) => regionLower.includes(r.toLowerCase()))) {
    score += 25;
    factors.regionMatch = true;
    detalle.push(`OK Region de operacion: ${lic.region}`);
  } else {
    riesgos.push(`WARNING Fuera de region principal (${lic.region})`);
    detalle.push(`NO Region no principal: ${lic.region}`);
  }

  // 2. Specialty match (25 puntos)
  const catLower = lic.categoria.toLowerCase();
  if (
    catLower.includes("construcc") ||
    catLower.includes("hvac") ||
    catLower.includes("climatiz") ||
    catLower.includes("montaje") ||
    catLower.includes("industrial")
  ) {
    score += 25;
    factors.specialtyMatch = true;
    detalle.push(`OK Especialidad alineada: ${lic.categoria}`);
  } else {
    detalle.push(`NO Especialidad no principal: ${lic.categoria}`);
    riesgos.push(`WARNING Especialidad ${lic.categoria} fuera del core de D&G`);
  }

  // 3. Monto match (20 puntos)
  if (lic.montoEstimado) {
    if (lic.montoEstimado >= DG_PROFILE.montosIdeales.min && lic.montoEstimado <= DG_PROFILE.montosIdeales.max) {
      score += 20;
      factors.montoMatch = true;
      detalle.push(`OK Monto ideal: $${(lic.montoEstimado / 1_000_000).toFixed(0)}M`);
    } else if (lic.montoEstimado > DG_PROFILE.montosMaximos) {
      score -= 15;
      riesgos.push(`WARNING Monto muy elevado: $${(lic.montoEstimado / 1_000_000).toFixed(0)}M (capacidad limitada)`);
      detalle.push(`NO Monto excede capacidad habitual`);
    } else if (lic.montoEstimado < DG_PROFILE.montosIdeales.min) {
      score += 5;
      detalle.push(`SLOW Monto menor a umbral ideal pero viable`);
    } else {
      score += 10;
      detalle.push(`SLOW Monto dentro de rango aceptable`);
    }
  } else {
    detalle.push(`UNKNOWN Monto no informado`);
  }

  // 4. Experience match via keywords (15 puntos)
  const text = `${lic.titulo} ${lic.descripcion}`.toLowerCase();
  const experienceTerms = [
    "escuela", "colegio", "hospital", "cesfam", "laboratorio",
    "climatiz", "split", "inverter", "silos", "plaza", "municipal"
  ];
  const matchedTerms = experienceTerms.filter((t) => text.includes(t));
  if (matchedTerms.length >= 2) {
    score += 15;
    factors.experienceMatch = true;
    detalle.push(`OK Experiencia previa similar: ${matchedTerms.slice(0, 3).join(", ")}`);
  } else if (matchedTerms.length === 1) {
    score += 8;
    detalle.push(`SLOW Una coincidencia de experiencia: ${matchedTerms[0]}`);
  } else {
    detalle.push(`NO Sin coincidencias claras de experiencia previa`);
  }

  // 5. Tiempo match (15 puntos)
  if (lic.diasHastaCierre !== null) {
    if (lic.diasHastaCierre >= 7 && lic.diasHastaCierre <= 30) {
      score += 15;
      factors.tiempoMatch = true;
      detalle.push(`OK Plazo optimo: ${lic.diasHastaCierre} dias`);
    } else if (lic.diasHastaCierre > 30) {
      score += 10;
      detalle.push(`SLOW Plazo amplio: ${lic.diasHastaCierre} dias`);
    } else if (lic.diasHastaCierre > 0) {
      score += 5;
      detalle.push(`WARNING Plazo corto: ${lic.diasHastaCierre} dias`);
      riesgos.push(`WARNING Quedan ${lic.diasHastaCierre} dias - preparacion apurada`);
    } else {
      score -= 10;
      detalle.push(`NO Cerrada o vencida`);
      riesgos.push(`WARNING Licitacion cerrada o vencida`);
    }
  } else {
    detalle.push(`UNKNOWN Fecha de cierre no informada`);
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // Probability
  let probability: MatchResult["probability"];
  if (score >= 80) probability = "alta";
  else if (score >= 60) probability = "media";
  else if (score >= 40) probability = "baja";
  else probability = "muy_baja";

  // Recommendations
  if (probability === "alta") {
    recomendaciones.push("TARGET Priorizar postulacion - alta probabilidad de adjudicacion");
    recomendaciones.push("DOCS Preparar documentacion tecnica y financiera de inmediato");
    recomendaciones.push("CREDIT Verificar linea de credito y garantias");
  } else if (probability === "media") {
    recomendaciones.push("EVAL Evaluar detalladamente pliegos y requisitos tecnicos");
    recomendaciones.push("SUB Consultar con subcontratistas especializados si aplica");
    recomendaciones.push("TEAM Confirmar disponibilidad de cuadrillas");
  } else {
    recomendaciones.push("WARNING Revisar viabilidad antes de invertir recursos en postulacion");
    recomendaciones.push("LEARN Considerar como oportunidad de aprendizaje / expansion");
  }

  return {
    licitacionId: lic.id,
    titulo: lic.titulo,
    matchScore: score,
    probability,
    factors,
    detalleAjuste: detalle,
    recomendaciones,
    riesgosIdentificados: riesgos,
  };
}

export function batchMatch(licitaciones: CleanLicitacion[]): MatchResult[] {
  return licitaciones.map((lic) => runMatch(lic));
}
