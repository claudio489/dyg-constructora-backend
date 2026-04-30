import { getDb } from "../queries/connection";
import { opportunities, matches } from "../../db/schema";
import { eq } from "drizzle-orm";

// ============================================================================
// CONFIGURACION
// ============================================================================
const MP_API_BASE = "https://api.mercadopublico.cl/servicios/v1/publico";
const MP_TICKET = process.env.MP_TICKET || "";

// Keywords D&G con pesos para scoring
const KEYWORDS_DG: Record<string, number> = {
  construccion: 15, obra: 10, civil: 10, "obra civil": 15,
  climatizacion: 25, acondicionado: 20, hvac: 25, refrigeracion: 20,
  calefaccion: 15, ventilacion: 15, split: 20, inverter: 20,
  montaje: 25, silos: 30, estructuras: 20, metalicas: 20,
  instalaciones: 15, electricidad: 10, reparacion: 10,
  conservacion: 15, escuela: 15, colegio: 15, educacion: 12,
  hospital: 18, cesfam: 18, salud: 15, municipalidad: 12,
  laboratorio: 18, cmpl: 20, pulp: 15, andamios: 15,
  vivienda: 10, industrial: 15, remodelacion: 12,
  "obra publica": 12, "parque eolico": 25, eolico: 20,
  tabiqueria: 10, pavimento: 8, cubierta: 10, muro: 8,
  pintura: 5, ducto: 15, "bomba calor": 15, "piso cielo": 15,
  "torre electrica": 15, fundacion: 10, caldera: 15,
  mantencion: 10, "aire acondicionado": 25, calefont: 15,
  estufa: 10, revestimiento: 10, carpinteria: 10,
  gasfiteria: 12, impermeabilizacion: 12, drywall: 10,
  ceramica: 8, porcelanato: 8,
};

const CATEGORIA_BY_KEYWORD: Record<string, string> = {
  construccion: "CONSTRUCCION", obra: "CONSTRUCCION", civil: "CONSTRUCCION",
  climatizacion: "HVAC", acondicionado: "HVAC", hvac: "HVAC",
  refrigeracion: "HVAC", calefaccion: "HVAC", split: "HVAC",
  inverter: "HVAC", ducto: "HVAC", ventilacion: "HVAC",
  "bomba calor": "HVAC", "piso cielo": "HVAC", "aire acondicionado": "HVAC",
  caldera: "HVAC", calefont: "HVAC",
  montaje: "MONTAJE", silos: "MONTAJE", estructuras: "MONTAJE",
  metalicas: "MONTAJE", industrial: "MONTAJE", laboratorio: "MONTAJE",
  cmpl: "MONTAJE", andamios: "MONTAJE",
  "parque eolico": "MONTAJE", eolico: "MONTAJE",
};

// Comunas/regiones del Biobío
const BIO_BIO_TERMS = ["biobio", "biobío", "concepcion", "concepción", "los angeles", "los ángeles",
  "chillan", "chillán", "coronel", "lota", "san pedro", "hualpen", "hualpén",
  "talcahuano", "penco", "laja", "nacimiento", "mulchen", "mulchén",
  "santa barbara", "santa bárbara", "quilaco", "quilleco", "yumbel",
  "cabrero", "ercilla", "rucalhue", "antuco", "hualqui", "san rosendo",
  "negrete", "tucapel", "alto biobio"];

// ============================================================================
// SCRAPER PRINCIPAL - TWO PHASE
// ============================================================================
export async function fetchMercadoPublicoOpportunities(options?: {
  ticket?: string;
  estado?: string;
  fecha?: string;
  soloBiobio?: boolean;
  maxDetailFetch?: number;
}): Promise<{ inserted: number; matched: number; errors: string[]; message: string; biobioCount: number }> {
  const errors: string[] = [];
  let inserted = 0;
  let matched = 0;
  let biobioCount = 0;
  const ticket = options?.ticket || MP_TICKET;
  const estado = options?.estado || "activas";
  const soloBiobio = options?.soloBiobio ?? false;
  const maxDetail = options?.maxDetailFetch || 100;

  // Fecha de hoy en formato DDMMYYYY
  const today = new Date();
  const fechaStr = options?.fecha || 
    `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

  try {
    // PHASE 1: Obtener listado completo
    let url = `${MP_API_BASE}/licitaciones.json?fecha=${fechaStr}&estado=${estado}`;
    if (ticket) url += `&ticket=${ticket}`;

    console.log(`[Scraper] Phase 1 - Fetching list: ${url.replace(ticket, '***')}`);

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "DYG-Constructora-Scraper/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    const data = await response.json() as any;
    const licitaciones = data?.Listado || [];
    console.log(`[Scraper] ${licitaciones.length} licitaciones encontradas`);

    // Quick scoring on name only
    const scored: { lic: any; score: number; matched: string[] }[] = [];
    for (const lic of licitaciones) {
      const name = lic?.Nombre || "";
      const scoreResult = quickScore(name);
      if (scoreResult.score >= 10) {
        scored.push({ lic, score: scoreResult.score, matched: scoreResult.matched });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    console.log(`[Scraper] ${scored.length} candidatas con score >= 10`);

    // PHASE 2: Obtener detalle de top candidatas
    const topCandidates = scored.slice(0, maxDetail);
    console.log(`[Scraper] Phase 2 - Fetching detail for top ${topCandidates.length}`);

    const db = getDb();

    for (const cand of topCandidates) {
      try {
        const mpId = cand.lic?.CodigoExterno;
        if (!mpId) continue;

        // Obtener detalle completo
        let detailUrl = `${MP_API_BASE}/licitaciones.json?codigo=${mpId}`;
        if (ticket) detailUrl += `&ticket=${ticket}`;

        const detailResp = await fetch(detailUrl, {
          headers: { "Accept": "application/json", "User-Agent": "DYG-Constructora-Scraper/1.0" },
          signal: AbortSignal.timeout(15000),
        });

        if (!detailResp.ok) continue;

        const detailData = await detailResp.json() as any;
        const lic = detailData?.Listado?.[0];
        if (!lic) continue;

        const comprador = lic?.Comprador || {};
        const region = comprador?.RegionUnidad || "";
        const comuna = comprador?.ComunaUnidad || "";
        const nombre = lic?.Nombre || "";
        const descripcion = lic?.Descripcion || "";
        const organismo = comprador?.NombreOrganismo || "";

        // Check Biobío
        const isBiobio = BIO_BIO_TERMS.some(term => 
          (region + " " + comuna).toLowerCase().includes(term)
        );
        if (isBiobio) biobioCount++;

        // Skip if soloBiobio and not Biobío (but still process all for scoring)
        if (soloBiobio && !isBiobio) continue;

        // Recalculate score with full data
        const fullText = `${nombre} ${descripcion} ${organismo} ${comuna} ${region}`;
        const matchResult = calculateMatchScore(fullText);
        if (isBiobio) matchResult.score = Math.min(matchResult.score + 10, 100);

        // Skip low scores
        if (matchResult.score < 15) continue;

        // Check if exists
        const existing = await db
          .select()
          .from(opportunities)
          .where(eq(opportunities.mpId, mpId.toString()));

        if (existing.length > 0) {
          const currentEstado = getEstadoString(lic?.CodigoEstado);
          if (currentEstado && currentEstado !== existing[0].estado) {
            await db.update(opportunities)
              .set({ estado: currentEstado as any, updatedAt: new Date() })
              .where(eq(opportunities.id, existing[0].id));
          }
          continue;
        }

        // Insert new opportunity
        const monto = lic?.MontoEstimado || null;
        const fechaPub = lic?.FechaPublicacion ? new Date(lic.FechaPublicacion) : null;
        const fechaCierre = lic?.FechaCierre ? new Date(lic.FechaCierre) : null;
        const estadoStr = getEstadoString(lic?.CodigoEstado);

        const result = await db.insert(opportunities).values({
          mpId: mpId.toString(),
          codigo: mpId.toString(),
          nombre,
          descripcion,
          organismo,
          region,
          comuna,
          montoEstimado: monto ? monto.toString() : null,
          fechaPublicacion: fechaPub,
          fechaCierre: fechaCierre,
          estado: (estadoStr || "Publicada") as any,
          categoriaMp: lic?.Tipo || null,
          rawData: lic,
        });

        const oppId = Number(result[0].insertId);
        inserted++;

        // AI Matching
        if (matchResult.score >= 20) {
          await db.insert(matches).values({
            opportunityId: oppId,
            score: matchResult.score,
            categoriaDg: matchResult.categoria as any,
            subcategoria: matchResult.subcategoria,
            keywordsMatched: matchResult.keywords,
            estado: "review",
            prioridad: matchResult.score >= 80 ? "alta" : matchResult.score >= 50 ? "media" : "baja",
          });
          matched++;
        }
      } catch (innerErr) {
        const msg = innerErr instanceof Error ? innerErr.message : String(innerErr);
        errors.push(`Lic ${cand.lic?.CodigoExterno}: ${msg}`);
      }
    }

    const msg = `Procesadas ${licitaciones.length} licitaciones. Score >=10: ${scored.length}, Insertadas: ${inserted}, Matches: ${matched}, Biobío: ${biobioCount}${!ticket ? ' (sin ticket)' : ''}`;
    console.log(`[Scraper] ${msg}`);

    return { inserted, matched, errors, message: msg, biobioCount };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[Scraper] Error: ${msg}`);
    return { inserted: 0, matched: 0, errors: [msg], message: `Error: ${msg}`, biobioCount: 0 };
  }
}

// ============================================================================
// QUICK SCORE (solo nombre, sin request adicional)
// ============================================================================
function quickScore(name: string): { score: number; matched: string[] } {
  const lower = name.toLowerCase();
  let score = 0;
  const matched: string[] = [];
  for (const [kw, weight] of Object.entries(KEYWORDS_DG)) {
    if (lower.includes(kw)) { score += weight; matched.push(kw); }
  }
  return { score: Math.min(score, 100), matched };
}

// ============================================================================
// AI MATCHING (con datos completos)
// ============================================================================
function calculateMatchScore(text: string): {
  score: number; categoria: string; subcategoria: string; keywords: string[];
} {
  const lowerText = text.toLowerCase();
  let score = 0;
  const matchedKeywords: string[] = [];
  const catScores: Record<string, number> = { CONSTRUCCION: 0, HVAC: 0, MONTAJE: 0 };

  for (const [keyword, weight] of Object.entries(KEYWORDS_DG)) {
    if (lowerText.includes(keyword)) {
      score += weight;
      matchedKeywords.push(keyword);
      const cat = CATEGORIA_BY_KEYWORD[keyword];
      if (cat) catScores[cat] += weight;
    }
  }

  // Bonus ubicación
  if (lowerText.includes("biobío") || lowerText.includes("biobio")) score += 10;
  if (lowerText.includes("los ángeles") || lowerText.includes("los angeles")) score += 15;

  // Categoría dominante
  let dominantCat = "CONSTRUCCION";
  let maxCatScore = catScores.CONSTRUCCION;
  if (catScores.HVAC > maxCatScore) { dominantCat = "HVAC"; maxCatScore = catScores.HVAC; }
  if (catScores.MONTAJE > maxCatScore) { dominantCat = "MONTAJE"; }

  // Subcategoría
  let subcategoria = "obra_general";
  if (dominantCat === "HVAC") subcategoria = "climatizacion_general";
  if (dominantCat === "MONTAJE") subcategoria = "montaje_general";
  if (matchedKeywords.includes("escuela") || matchedKeywords.includes("colegio")) subcategoria = "infraestructura_educativa";
  if (matchedKeywords.includes("hospital") || matchedKeywords.includes("cesfam")) subcategoria = "infraestructura_salud";
  if (matchedKeywords.includes("silos")) subcategoria = "silos_estructuras";
  if (matchedKeywords.includes("laboratorio")) subcategoria = "laboratorios_industriales";
  if (matchedKeywords.includes("eolico") || matchedKeywords.includes("parque eolico")) subcategoria = "energia_eolica";
  if (matchedKeywords.includes("caldera") || matchedKeywords.includes("calefaccion")) subcategoria = "calefaccion_industrial";
  if (matchedKeywords.includes("aire acondicionado") || matchedKeywords.includes("climatizacion")) subcategoria = "climatizacion_integral";

  return { score: Math.min(score, 100), categoria: dominantCat, subcategoria, keywords: matchedKeywords };
}

function getEstadoString(codigo: number | string): string | null {
  const map: Record<string, string> = {
    "5": "Publicada", "6": "Cerrada", "7": "Desierta",
    "8": "Adjudicada", "18": "Revocada", "19": "Suspendida",
  };
  return map[String(codigo)] || null;
}

// ============================================================================
// SYNC ESTADOS
// ============================================================================
export async function syncOpportunityStatuses(ticket?: string) {
  const errors: string[] = [];
  let updated = 0;
  const db = getDb();

  try {
    const activeOps = await db
      .select()
      .from(opportunities)
      .where(eq(opportunities.estado, "Publicada"));

    for (const op of activeOps.slice(0, 50)) {
      try {
        let url = `${MP_API_BASE}/licitaciones.json?codigo=${op.mpId}`;
        if (ticket || MP_TICKET) url += `&ticket=${ticket || MP_TICKET}`;

        const response = await fetch(url, {
          headers: { "Accept": "application/json" },
          signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) continue;

        const data = await response.json() as any;
        const lic = data?.Listado?.[0];
        if (!lic) continue;

        const nuevoEstado = getEstadoString(lic?.CodigoEstado);
        if (nuevoEstado && nuevoEstado !== op.estado) {
          await db.update(opportunities)
            .set({ estado: nuevoEstado as any, updatedAt: new Date() })
            .where(eq(opportunities.id, op.id));
          updated++;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Sync ${op.mpId}: ${msg}`);
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`Fatal: ${msg}`);
  }

  return { updated, errors };
}
