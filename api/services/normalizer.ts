// api/services/normalizer.ts

import type { RawLicitacion } from "../scraper/engine";

export type Licitacion = {
  title: string;
  entity: string;
  amount: number;
  date: string;
  location: string;
  url: string;
  category: string;
  priority: "low" | "medium" | "high";
  score: number;
};

// normalización simple pero estable
export function normalizeLicitaciones(
  data: RawLicitacion[]
): Licitacion[] {
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const amount = item.amount ?? 0;

    const score = calculateScore(amount, item.title);

    return {
      title: item.title || "Sin título",
      entity: item.entity || "Desconocido",
      amount,
      date: item.date || new Date().toISOString(),
      location: item.location || "Chile",
      url: item.url || "#",

      category: detectCategory(item.title),
      priority: score > 70 ? "high" : score > 40 ? "medium" : "low",
      score,
    };
  });
}

// 🔥 scoring simple estable (evita NaN y crashes)
function calculateScore(amount: number, title: string): number {
  let score = 20;

  if (amount > 100000000) score += 40;
  else if (amount > 50000000) score += 25;
  else if (amount > 10000000) score += 15;

  if (title?.toLowerCase().includes("hvac")) score += 10;
  if (title?.toLowerCase().includes("construcción")) score += 15;
  if (title?.toLowerCase().includes("eléctrica")) score += 10;

  return Math.min(100, score);
}

// categorización simple
function detectCategory(title: string): string {
  const t = (title || "").toLowerCase();

  if (t.includes("hvac") || t.includes("climatización")) return "climatización";
  if (t.includes("eléctr")) return "electricidad";
  if (t.includes("constru")) return "construcción";
  if (t.includes("mantención")) return "mantención";

  return "general";
}