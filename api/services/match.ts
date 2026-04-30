export function matchEngine(data: any[]) {
  return data.map((item) => {
    const score = item.ai?.score || 0;

    return {
      ...item,
      matchScore: score,
      probability:
        score > 75
          ? "alta"
          : score > 50
          ? "media"
          : "baja",
      flags: {
        regionMatch: item.location === "Biobío",
        amountOK: item.amount < 100000000,
      },
    };
  });
}