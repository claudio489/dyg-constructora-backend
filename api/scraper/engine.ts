// api/scraper/engine.ts

export type RawLicitacion = {
  title: string;
  entity?: string;
  amount?: number;
  date?: string;
  location?: string;
  url?: string;
  source?: string;
};

export async function scrapeLicitaciones(): Promise<RawLicitacion[]> {
  try {
    // 🔥 AQUÍ después conectas Mercado Público real
    // por ahora dejamos base estable para evitar crashes

    const mockData: RawLicitacion[] = [
      {
        title: "Mantención HVAC hospital regional",
        entity: "MINSAL",
        amount: 45000000,
        date: "2026-04-01",
        location: "Biobío",
        url: "https://example.com",
        source: "mock",
      },
      {
        title: "Construcción sala eléctrica industrial",
        entity: "CODELCO",
        amount: 120000000,
        date: "2026-03-28",
        location: "Antofagasta",
        url: "https://example.com",
        source: "mock",
      },
    ];

    // simula latencia real de scraping
    await new Promise((r) => setTimeout(r, 300));

    return mockData;
  } catch (error: any) {
    console.error("[scraper engine error]", error);
    return [];
  }
}