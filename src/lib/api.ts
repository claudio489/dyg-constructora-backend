// ============================================================================
// DYG LICITACIONES — Cliente REST puro (sin tRPC, sin OAuth)
// ============================================================================

export const API_URL = import.meta.env.VITE_API_URL || "https://dyg-constructora-backend.onrender.com";

async function apiFetch(path: string, opts?: RequestInit) {
  const url = `${API_URL}${path}`;
  const resp = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts?.headers || {}),
    },
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return resp.json();
}

// ─── Opportunities ───────────────────────────────────────────────────────────

export async function generatePipeline(body: {
  maxResultados?: number;
  soloBiobio?: boolean;
  minScore?: number;
}) {
  return apiFetch("/api/opportunities/generate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function listOpportunities(params?: {
  estado?: string;
  region?: string;
  minScore?: number;
  limit?: number;
}) {
  const qs = params ? "?" + new URLSearchParams(params as any).toString() : "";
  return apiFetch(`/api/opportunities${qs}`);
}

export async function getOpportunityStats() {
  return apiFetch("/api/opportunities/stats");
}

// ─── Matches ─────────────────────────────────────────────────────────────────

export async function listMatches(params?: {
  minScore?: number;
  limit?: number;
}) {
  const qs = params ? "?" + new URLSearchParams(params as any).toString() : "";
  return apiFetch(`/api/matches${qs}`);
}

export async function getMatchStats() {
  return apiFetch("/api/matches/stats");
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export async function analyzeLicitacion(body: {
  titulo: string;
  descripcion?: string;
  entidad?: string;
  montoEstimado?: number | null;
  region?: string;
  comuna?: string;
  categoria?: string;
  palabrasClave?: string[];
}) {
  return apiFetch("/api/ai/analyze", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Health ─────────────────────────────────────────────────────────────────

export async function ping() {
  return apiFetch("/ping");
}
