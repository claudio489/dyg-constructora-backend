export async function analyzeWithKimi(data: any[]) {
  return data.map((item) => {
    return {
      ...item,
      ai: {
        score: 60,
        risk: "medio",
        recommendation: "REVISAR",
        justificacion: "análisis fallback (KIMI no conectado)",
      },
    };
  });
}