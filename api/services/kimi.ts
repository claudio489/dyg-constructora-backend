export async function analyzeWithKimi(data: any[]) {
  return data.map((item) => ({
    ...item,
    ai: {
      score: 60,
      risk: "medio",
      recommendation: "REVISAR",
    },
  }));
}