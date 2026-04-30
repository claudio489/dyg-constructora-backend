/**
 * ============================================================================
 * DYG LICITACIONES - SCRAPER ENGINE
 * ============================================================================
 * Extrae licitaciones desde Mercado Publico Chile (ChileCompra).
 * Sin caracteres especiales para compatibilidad ZIP.
 */

// ─── Config ──────────────────────────────────────────────────────────────────

const MP_API_BASE = "https://api.mercadopublico.cl/servicios/v1/publico";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RawLicitacion {
  codigo: string;
  titulo: string;
  entidad: string;
  montoEstimado: number | null;
  fechaPublicacion: string | null;
  fechaCierre: string | null;
  ubicacion: {
    region: string;
    comuna: string;
  };
  link: string;
  estado: string;
  categoria: string;
  descripcion: string;
  raw: any;
}

export interface ScraperResult {
  fuente: string;
  fechaExtraccion: string;
  totalExtraido: number;
  licitaciones: RawLicitacion[];
  errores: string[];
}

// ─── Mercado Publico Chile ───────────────────────────────────────────────────

export async function scrapeMercadoPublico(options?: {
  ticket?: string;
  fecha?: string;
  maxPaginas?: number;
}): Promise<ScraperResult> {
  const ticket = options?.ticket || process.env.MP_TICKET || "";
  const maxPaginas = options?.maxPaginas || 1;
  const errores: string[] = [];
  const licitaciones: RawLicitacion[] = [];

  const today = new Date();
  const fechaStr = options?.fecha ||
    `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${today.getFullYear()}`;

  try {
    let url = `${MP_API_BASE}/licitaciones.json?fecha=${fechaStr}&estado=activas`;
    if (ticket) url += `&ticket=${ticket}`;

    console.log(`[Scraper] Fetching ${url.replace(ticket, '***')}`);

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "DYG-Licitaciones-Scraper/1.0",
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const listado = data?.Listado || [];

    console.log(`[Scraper] ${listado.length} licitaciones encontradas`);

    const topItems = listado.slice(0, 100);

    for (const item of topItems) {
      try {
        const codigo = item?.CodigoExterno;
        if (!codigo) continue;

        let detailUrl = `${MP_API_BASE}/licitaciones.json?codigo=${codigo}`;
        if (ticket) detailUrl += `&ticket=${ticket}`;

        const detailResp = await fetch(detailUrl, {
          headers: { Accept: "application/json", "User-Agent": "DYG-Licitaciones-Scraper/1.0" },
          signal: AbortSignal.timeout(10000),
        });

        if (!detailResp.ok) {
          errores.push(`Detalle ${codigo}: HTTP ${detailResp.status}`);
          licitaciones.push(mapFromListado(item));
          continue;
        }

        const detailData = await detailResp.json() as any;
        const lic = detailData?.Listado?.[0];

        if (lic) {
          licitaciones.push(mapFromDetail(lic));
        } else {
          licitaciones.push(mapFromListado(item));
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errores.push(`Lic ${item?.CodigoExterno}: ${msg}`);
        licitaciones.push(mapFromListado(item));
      }
    }

    return {
      fuente: "MercadoPublico.cl",
      fechaExtraccion: new Date().toISOString(),
      totalExtraido: licitaciones.length,
      licitaciones,
      errores,
    };

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      fuente: "MercadoPublico.cl",
      fechaExtraccion: new Date().toISOString(),
      totalExtraido: 0,
      licitaciones: [],
      errores: [msg],
    };
  }
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapFromListado(item: any): RawLicitacion {
  const comprador = item?.Comprador || {};
  return {
    codigo: String(item?.CodigoExterno || "unknown"),
    titulo: String(item?.Nombre || "").slice(0, 200),
    entidad: String(comprador?.NombreOrganismo || "").slice(0, 150),
    montoEstimado: item?.MontoEstimado || null,
    fechaPublicacion: item?.FechaPublicacion || null,
    fechaCierre: item?.FechaCierre || null,
    ubicacion: {
      region: String(comprador?.RegionUnidad || ""),
      comuna: String(comprador?.ComunaUnidad || ""),
    },
    link: `https://www.mercadopublico.cl/Procurement/Modules/RFB/Details.aspx?id=${item?.CodigoExterno}`,
    estado: mapEstado(item?.CodigoEstado),
    categoria: String(item?.Tipo || "Licitacion"),
    descripcion: "",
    raw: item,
  };
}

function mapFromDetail(lic: any): RawLicitacion {
  const comprador = lic?.Comprador || {};
  return {
    codigo: String(lic?.CodigoExterno || "unknown"),
    titulo: String(lic?.Nombre || "").slice(0, 200),
    entidad: String(comprador?.NombreOrganismo || "").slice(0, 150),
    montoEstimado: lic?.MontoEstimado || null,
    fechaPublicacion: lic?.FechaPublicacion || null,
    fechaCierre: lic?.FechaCierre || null,
    ubicacion: {
      region: String(comprador?.RegionUnidad || ""),
      comuna: String(comprador?.ComunaUnidad || ""),
    },
    link: `https://www.mercadopublico.cl/Procurement/Modules/RFB/Details.aspx?id=${lic?.CodigoExterno}`,
    estado: mapEstado(lic?.CodigoEstado),
    categoria: String(lic?.Tipo || "Licitacion"),
    descripcion: String(lic?.Descripcion || "").slice(0, 500),
    raw: lic,
  };
}

function mapEstado(codigo: number | string): string {
  const map: Record<string, string> = {
    "5": "Publicada", "6": "Cerrada", "7": "Desierta",
    "8": "Adjudicada", "18": "Revocada", "19": "Suspendida",
  };
  return map[String(codigo)] || "Publicada";
}

// ─── Health Check ────────────────────────────────────────────────────────────

export async function checkScraperHealth(): Promise<{ ok: boolean; mpTicketConfigured: boolean; mpApiReachable: boolean }> {
  const mpTicket = process.env.MP_TICKET || "";
  let mpApiReachable = false;

  try {
    const url = `${MP_API_BASE}/licitaciones.json?fecha=01012026&estado=activas&ticket=${mpTicket}`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    mpApiReachable = resp.ok;
  } catch {
    mpApiReachable = false;
  }

  return {
    ok: mpApiReachable,
    mpTicketConfigured: !!mpTicket,
    mpApiReachable,
  };
}
