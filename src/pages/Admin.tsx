import { useState } from 'react';
import { Link } from 'react-router';
import { trpc } from '@/providers/trpc';
import { useAuth } from '@/hooks/useAuth';
import { 
  Play, RotateCw, BarChart3, Database, AlertCircle,
  CheckCircle2, ArrowLeft, Settings
} from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const statsQuery = trpc.opportunity.stats.useQuery();
  const scraperMutation = trpc.opportunity.triggerScraper.useMutation({
    onSuccess: (data: { message: string; inserted: number; matched: number }) => {
      setResult(`${data.message}\nInsertadas: ${data.inserted}, Matches: ${data.matched}`);
      setLoading(false);
      statsQuery.refetch();
    },
    onError: (err: { message: string }) => {
      setResult(`Error: ${err.message}`);
      setLoading(false);
    },
  });
  const syncMutation = trpc.opportunity.syncStatuses.useMutation({
    onSuccess: (data: { updated: number; errors: string[] }) => {
      setResult(`Estados sincronizados: ${data.updated} actualizados`);
      setLoading(false);
      statsQuery.refetch();
    },
    onError: (err: { message: string }) => {
      setResult(`Error: ${err.message}`);
      setLoading(false);
    },
  });

  const runScraper = () => {
    setLoading(true);
    setResult('Ejecutando scraper...');
    scraperMutation.mutate({ estado: "activas", soloBiobio: true });
  };

  const syncStatuses = () => {
    setLoading(true);
    setResult('Sincronizando estados...');
    syncMutation.mutate();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="card-dg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acceso restringido</h2>
          <p className="text-gray-400 mb-4">Solo administradores pueden acceder a esta página.</p>
          <Link to="/" className="text-amber-400 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <div className="bg-[#111827] border-b border-[#1f2937]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">Panel de Administración</span>
          </div>
          <Link to="/" className="text-sm text-gray-400 hover:text-amber-400 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-dg p-5 text-center">
            <Database className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{statsQuery.data?.total || 0}</div>
            <div className="text-xs text-gray-500 uppercase">Total oportunidades</div>
          </div>
          <div className="card-dg p-5 text-center">
            <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{statsQuery.data?.publicadas || 0}</div>
            <div className="text-xs text-gray-500 uppercase">Activas</div>
          </div>
          <div className="card-dg p-5 text-center">
            <BarChart3 className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{statsQuery.data?.matches || 0}</div>
            <div className="text-xs text-gray-500 uppercase">Matches D&G</div>
          </div>
          <div className="card-dg p-5 text-center">
            <AlertCircle className="w-5 h-5 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{statsQuery.data?.altaRelevancia || 0}</div>
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
              Busca licitaciones activas en Mercado Público (ChileCompra) para la Región del Biobío 
              y ejecuta el AI matching para clasificarlas por relevancia.
            </p>
            <button 
              onClick={runScraper}
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              {loading ? 'Ejecutando...' : 'Ejecutar scraper ahora'}
            </button>
          </div>

          <div className="card-dg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <RotateCw className="w-5 h-5 text-blue-400" />
              Sincronizar Estados
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Actualiza el estado de las licitaciones públicas (Publicada → Cerrada → Adjudicada) 
              consultando la API de Mercado Público.
            </p>
            <button 
              onClick={syncStatuses}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl border-2 border-blue-500/30 text-blue-400 font-semibold hover:bg-blue-500/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
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
          <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Configuración API</h4>
          <p className="text-sm text-gray-500 mb-2">
            <strong>API:</strong> api.mercadopublico.cl/servicios/v1/publico
          </p>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Ticket:</strong> {process.env.MP_TICKET ? 'Configurado' : 'No configurado'}
          </p>
          <p className="text-sm text-gray-500">
            Para obtener un ticket gratuito: <a href="https://api.mercadopublico.cl" target="_blank" rel="noopener" className="text-amber-400 hover:underline">api.mercadopublico.cl → Participa</a> (requiere Clave Única)
          </p>
        </div>
      </div>
    </div>
  );
}
