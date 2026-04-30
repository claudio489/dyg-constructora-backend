import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Play, RotateCw, BarChart3, Database, AlertCircle,
  CheckCircle2, ArrowLeft, Settings, Loader2
} from 'lucide-react';
import { generatePipeline, getOpportunityStats, getMatchStats, ping } from '@/lib/api';

export default function Admin() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>({ total: 0, publicadas: 0, matches: 0, altaRelevancia: 0 });
  const [matchStats, setMatchStats] = useState<any>({ total: 0, alta: 0, media: 0, baja: 0 });
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [oppStats, mStats, healthRes] = await Promise.all([
        getOpportunityStats(),
        getMatchStats(),
        ping(),
      ]);
      setStats({
        total: oppStats.total || 0,
        publicadas: oppStats.byEstado?.Publicada || 0,
        matches: mStats.total || 0,
        altaRelevancia: mStats.alta || 0,
      });
      setMatchStats(mStats);
      setHealth(healthRes);
    } catch (err) {
      console.error('Stats error:', err);
    }
  }

  async function runScraper() {
    setLoading(true);
    setResult('Ejecutando scraper...');
    try {
      const res = await generatePipeline({ maxResultados: 50, soloBiobio: true, minScore: 40 });
      setResult(
        `Pipeline OK!\n` +
        `Oportunidades: ${res.count}\n` +
        `Scrapeados: ${res.pipeline?.totalScrapeados}\n` +
        `Normalizados: ${res.pipeline?.totalNormalizados}\n` +
        `Guardados en DB: ${res.pipeline?.guardadosEnDB}\n` +
        `Errores: ${res.pipeline?.errores}\n` +
        `Duracion: ${res.pipeline?.duracionMs}ms`
      );
      await loadStats();
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function syncStatuses() {
    setLoading(true);
    setResult('Sincronizando estados...');
    try {
      // The pipeline already syncs — just run it again or call opportunities list
      const res = await generatePipeline({ maxResultados: 100, soloBiobio: false, minScore: 0 });
      setResult(`Estados sincronizados. Pipeline ejecutado: ${res.count} oportunidades procesadas.`);
      await loadStats();
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-[#1f2937]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Panel de Administracion</span>
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-amber-400 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Health */}
        {health && (
          <div className="mb-6 p-4 rounded-lg border border-green-500/20 bg-green-500/5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <div className="text-sm text-green-400">
              Backend OK — v{health.version} | {health.service} | {health.features?.join(', ')}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-dg p-5 text-center">
            <Database className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 uppercase">Total oportunidades</div>
          </div>
          <div className="card-dg p-5 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.publicadas}</div>
            <div className="text-xs text-gray-500 uppercase">Activas</div>
          </div>
          <div className="card-dg p-5 text-center">
            <BarChart3 className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.matches}</div>
            <div className="text-xs text-gray-500 uppercase">Matches D&G</div>
          </div>
          <div className="card-dg p-5 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.altaRelevancia}</div>
            <div className="text-xs text-gray-500 uppercase">Alta relevancia</div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-dg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-400" />
              Ejecutar Scraper
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Busca licitaciones activas en Mercado Publico (ChileCompra) para la Region del Biobio 
              y ejecuta el AI matching para clasificarlas por relevancia.
            </p>
            <button 
              onClick={runScraper}
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {loading ? 'Ejecutando...' : 'Ejecutar scraper ahora'}
            </button>
          </div>

          <div className="card-dg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-blue-400" />
              Sincronizar Estados
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Actualiza el estado de las licitaciones publicas (Publicada → Cerrada → Adjudicada) 
              consultando la API de Mercado Publico.
            </p>
            <button 
              onClick={syncStatuses}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl border-2 border-blue-500/30 text-blue-400 font-semibold hover:bg-blue-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
              {loading ? 'Sincronizando...' : 'Sincronizar estados'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`card-dg p-6 ${result.includes('Error') ? 'border-red-500/30' : 'border-green-500/30'}`}>
            <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Resultado</h4>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{result}</pre>
          </div>
        )}

        {/* Info */}
        <div className="card-dg p-6 mt-6">
          <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Configuracion API</h4>
          <p className="text-sm text-gray-500 mb-2">
            <strong>API:</strong> api.mercadopublico.cl/servicios/v1/publico
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Backend:</strong> {API_URL}
          </p>
          <p className="text-sm text-gray-500">
            Para obtener un ticket gratuito: <a href="https://api.mercadopublico.cl" target="_blank" rel="noopener" className="text-amber-400 hover:underline">api.mercadopublico.cl → Participa</a> (requiere Clave Unica)
          </p>
        </div>
      </div>
    </div>
  );
}
