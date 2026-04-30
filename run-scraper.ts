
import { fetchMercadoPublicoOpportunities } from "./api/scraper/mercado-publico";

async function main() {
  console.log("🚀 Iniciando scraper...");
  const result = await fetchMercadoPublicoOpportunities({
    soloBiobio: false,  // Capturar todas las regiones con score alto
    maxDetailFetch: 150,
  });
  console.log("✅ Resultado:", result);
  process.exit(0);
}

main().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
