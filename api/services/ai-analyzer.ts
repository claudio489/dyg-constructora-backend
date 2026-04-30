/**
 * ============================================================================
 * DYG LICITACIONES - AI ANALYZER
 * ============================================================================
 * Motor de analisis de licitaciones usando KIMI (backend-only).
 * Sin caracteres especiales para compatibilidad ZIP.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AIAnalysisInput {
  titulo: string;
  descripcion: string;
  entidad: string;
  montoEstimado: number | null;
  region: string;
  comuna: string;
  categoria: string;
  palabrasClave: string[];
}

export interface AIAnalysisOutput {
  score: number;
  nivelRiesgo: "bajo" | "medio" | "alto" | "critico";
  complejidadTecnica: "baja" | "media" | "alta";
  recomendacion: "APLICAR" | "NO APLICAR" | "REVISAR";
  justificacion: string;
  factoresPositivos: string[];
  factoresNegativos: string[];
  accionesSugeridas: string[];
}

// ─── Config ──────────────────────────────────────────────────────────────────

const KIMI_API_KEY = process.env.KIMI_API_KEY || "";
const KIMI_API_BASE = "https://api.moonshot.cn/v1";
const DEFAULT_MODEL = "moonshot-v1-8k";

// ─── Prompt Template ─────────────────────────────────────────────────────────

const ANALYSIS_PROMPT = `Eres un analista senior de licitaciones publicas chilenas para D&G Constructora SPA.
Evalua la siguiente licitacion y responde UNICAMENTE con un JSON valido.

Formato de respuesta (JSON estricto):
{
  "score": 0-100,
  "nivelRiesgo": "bajo|medio|alto|critico",
  "complejidadTecnica": "baja|media|alta",
  "recomendacion": "APLICAR|NO APLICAR|REVISAR",
  "justificacion": "string",
  "factoresPositivos": ["string", "string"],
  "factoresNegativos": ["string", "string"],
  "accionesSugeridas": ["string", "string"]
}

Criterios de D&G Constructora:
- Especialidades: Construccion, HVAC (climatizacion), Montaje industrial
- Region principal: Biobio, Chile (tambien operan en Nuble, Araucania)
- Experiencia: Escuelas MINEDUC, CESFAM / Hospitales MINSAL, laboratorios CMPC, silos industriales, plazas municipales, viviendas sociales
- Factores positivos: Montos $10M-$500M, obras en Biobio, climatizacion, infraestructura educativa/salud
- Factores negativos: Montos >$1.000M (capacidad limitada), obras fuera de Chile, tecnologias no dominadas

Datos de la licitacion:
Titulo: {{TITULO}}
Descripcion: {{DESCRIPCION}}
Entidad: {{ENTIDAD}}
Monto estimado: {{MONTO}}
Ubicacion: {{UBICACION}}
Categoria detectada: {{CATEGORIA}}
Palabras clave: {{KEYWORDS}}

Responde SOLO con JSON valido. No incluyas markdown, no explicaciones adicionales.`;

// ─── AI Call ─────────────────────────────────────────────────────────────────

async function callKimi(prompt: string): Promise<string> {
  if (!KIMI_API_KEY) {
    console.warn("[AI] KIMI_API_KEY not set. Using fallback analysis.");
    return generateFallback(prompt);
  }

  try {
    const resp = await fetch(`${KIMI_API_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KIMI_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: "Eres un analista de licitaciones publicas chilenas. Respondes SOLO con JSON valido." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`KIMI ${resp.status}: ${text}`);
    }

    const data = await resp.json() as any;
    return data.choices?.[0]?.message?.content || "";
  } catch (err) {
    console.error("[AI] KIMI call failed:", err);
    return generateFallback(prompt);
  }
}

// ─── Fallback (heuristics) ───────────────────────────────────────────────────

function generateFallback(prompt: string): string {
  const lower = prompt.toLowerCase();

  const hasHvac = /climatiza|acondicionado|hvac|split|inverter|calefacci|ventilaci|caldera/.test(lower);
  const hasConstruccion = /construcci|obra|escuela|colegio|hospital|cesfam|municipalidad|vivienda|plaza|sede|edificio/.test(lower);
  const hasMontaje = /montaje|silos|estructura|metalica|industrial|laboratorio/.test(lower);
  const isBiobio = /biobio|concepci|los angeles|chillan|laja|nacimiento|quilaco|quilleco|yumbel|hualqui|ercilla/.test(lower);

  let score = 40;
  if (isBiobio) score += 20;
  if (hasHvac) score += 20;
  if (hasConstruccion) score += 15;
  if (hasMontaje) score += 15;

  const montoMatch = prompt.match(/Monto estimado:\s*(\d[\d,\.]*)/);
  if (montoMatch) {
    const monto = parseFloat(montoMatch[1].replace(/[,.]/g, ""));
    if (monto > 1_000_000_000) score -= 20;
    else if (monto > 500_000_000) score -= 10;
    else if (monto > 10_000_000 && monto < 500_000_000) score += 10;
  }

  score = Math.max(5, Math.min(95, score));

  const nivelRiesgo = score > 75 ? "bajo" : score > 55 ? "medio" : score > 35 ? "alto" : "critico";
  const complejidad = hasHvac || hasMontaje ? "media" : "baja";
  const recomendacion = score > 70 ? "APLICAR" : score > 45 ? "REVISAR" : "NO APLICAR";

  const factoresPositivos: string[] = [];
  if (isBiobio) factoresPositivos.push("Ubicada en region de operacion D&G (Biobio)");
  if (hasHvac) factoresPositivos.push("Linea de negocio HVAC alineada con capacidades");
  if (hasConstruccion) factoresPositivos.push("Sector construccion con track record comprobado");

  const factoresNegativos: string[] = [];
  if (!isBiobio) factoresNegativos.push("Fuera de region principal de operacion");

  return JSON.stringify({
    score,
    nivelRiesgo,
    complejidadTecnica: complejidad,
    recomendacion,
    justificacion: `Score ${score}/100 basado en analisis heuristico. ${isBiobio ? "Region favorable." : "Evaluar logistica."}`,
    factoresPositivos,
    factoresNegativos,
    accionesSugeridas: score > 70 ? ["Priorizar postulacion", "Revisar pliegos tecnicos"] : ["Evaluar viabilidad", "Consultar con equipo comercial"],
  });
}

// ─── Parser ──────────────────────────────────────────────────────────────────

function parseAIResponse(raw: string): AIAnalysisOutput {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: clampNum(parsed.score, 0, 100),
      nivelRiesgo: ["bajo", "medio", "alto", "critico"].includes(parsed.nivelRiesgo) ? parsed.nivelRiesgo : "medio",
      complejidadTecnica: ["baja", "media", "alta"].includes(parsed.complejidadTecnica) ? parsed.complejidadTecnica : "media",
      recomendacion: ["APLICAR", "NO APLICAR", "REVISAR"].includes(parsed.recomendacion) ? parsed.recomendacion : "REVISAR",
      justificacion: String(parsed.justificacion || "").slice(0, 300),
      factoresPositivos: Array.isArray(parsed.factoresPositivos) ? parsed.factoresPositivos.slice(0, 5) : [],
      factoresNegativos: Array.isArray(parsed.factoresNegativos) ? parsed.factoresNegativos.slice(0, 5) : [],
      accionesSugeridas: Array.isArray(parsed.accionesSugeridas) ? parsed.accionesSugeridas.slice(0, 5) : [],
    };
  } catch (err) {
    console.error("[AI] Parse failed:", err, "Raw:", raw.slice(0, 200));
    return {
      score: 50,
      nivelRiesgo: "medio",
      complejidadTecnica: "media",
      recomendacion: "REVISAR",
      justificacion: "Error al parsear respuesta de IA. Revisar manualmente.",
      factoresPositivos: [],
      factoresNegativos: ["Error de analisis automatico"],
      accionesSugeridas: ["Revisar licitacion manualmente"],
    };
  }
}

function clampNum(n: any, min: number, max: number): number {
  const num = Number(n);
  if (isNaN(num)) return min;
  return Math.max(min, Math.min(max, num));
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function analyzeLicitacion(input: AIAnalysisInput): Promise<AIAnalysisOutput> {
  const prompt = ANALYSIS_PROMPT
    .replace("{{TITULO}}", input.titulo)
    .replace("{{DESCRIPCION}}", input.descripcion || "Sin descripcion")
    .replace("{{ENTIDAD}}", input.entidad)
    .replace("{{MONTO}}", input.montoEstimado ? `$${input.montoEstimado.toLocaleString()} CLP` : "No informado")
    .replace("{{UBICACION}}", `${input.comuna}, ${input.region}`)
    .replace("{{CATEGORIA}}", input.categoria)
    .replace("{{KEYWORDS}}", input.palabrasClave.join(", "));

  const raw = await callKimi(prompt);
  return parseAIResponse(raw);
}

export async function batchAnalyze(inputs: AIAnalysisInput[]): Promise<AIAnalysisOutput[]> {
  return Promise.all(inputs.map((input) => analyzeLicitacion(input)));
}

export function getAIStatus(): { status: string; apiKeyConfigured: boolean; model: string } {
  return {
    status: KIMI_API_KEY ? "ready" : "fallback-mode",
    apiKeyConfigured: !!KIMI_API_KEY,
    model: DEFAULT_MODEL,
  };
}
