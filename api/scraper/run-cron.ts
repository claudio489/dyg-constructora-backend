/**
 * Cron job para ejecutar el scraper de Mercado Publico
 * Uso: npx tsx api/scraper/run-cron.ts
 * O en crontab: 0 */6 * * * cd /var/www/dygconstructora && npx tsx api/scraper/run-cron.ts >> /var/log/dg-scraper.log 2>&1
 */

import { fetchMercadoPublicoOpportunities, syncOpportunityStatuses } from "./mercado-publico";

async function run() {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] Iniciando scraper D&G...`);

  try {
    // 1. Fetch nuevas oportunidades
    console.log("[Scraper] Buscando licitaciones activas...");
    const result = await fetchMercadoPublicoOpportunities({
      estado: "activas",
      soloBiobio: true,
    });
    console.log(`[Scraper] ${result.message}`);

    // 2. Sync estados de licitaciones existentes
    console.log("[Scraper] Sincronizando estados...");
    const sync = await syncOpportunityStatuses();
    console.log(`[Scraper] Estados sincronizados: ${sync.updated}`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[${new Date().toISOString()}] Scraper completado en ${duration}s`);
    process.exit(0);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ERROR:`, err);
    process.exit(1);
  }
}

run();
