import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { 
  Filter, 
  Star, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Building2,
  ArrowLeft,
  AlertTriangle,
  Play,
  Loader2
} from 'lucide-react';
import { listOpportunities, getOpportunityStats, listMatches, generatePipeline } from '@/lib/api';

export default function Dashboard() {
  const [filterCat, setFilterCat] = useState<'ALL' | 'CONSTRUCCION' | 'HVAC' | 'MONTAJE'>('ALL');
  const [filterPrioridad, setFilterPrioridad] = useState<'ALL' | 'alta' | 'media' | 'baja'>('ALL');
  const [search, setSearch] = useState('');
  
  const [oppLoading, setOppLoading] = useState(true);
  const [matchesList, setMatchesList] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, alta: 0, media: 0, baja: 0, avgMonto: 0 });
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setOppLoading(true);
    setError('');
    try {
      const [matchesRes, statsRes] = await Promise.all([
        listMatches({ minScore: 20, limit: 100 }),
        getOpportunityStats(),
      ]);
      setMatchesList(matchesRes.data || []);
      setStats(statsRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
    } finally {
      setOppLoading(false);
    }
  }

  async function runPipeline() {
    setPipelineRunning(true);
    setPipelineResult('Ejecutando pipeline...');
    setError('');
    try {
      const res = await generatePipeline({ maxResultados: 50, soloBiobio: true, minScore: 40 });
      setPipelineResult(
        `Pipeline OK: ${res.count} oportunidades | ` +
        `Scrapeados: ${res.pipeline?.totalScrapeados || 0} | ` +
        `Guardados: ${res.pipeline?.guardadosEnDB || 0} | ` +
        `Duracion: ${res.pipeline?.duracionMs || 0}ms`
      );
      // Refresh data after pipeline
      await loadData();
    } catch (err) {
      setPipelineResult('Error en pipeline');
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setPipelineRunning(false);
    }
  }

  const filtered = matchesList.filter((m: any) => {
    if (filterCat !== 'ALL' && m.categoriaDg !== filterCat) return false;
    if (filterPrioridad !== 'ALL' && m.prioridad !== filterPrioridad) return false;
    if (search && !m.subcategoria?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/15 border-green-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    return 'text-gray-400 bg-gray-500/15 border-gray-500/30';
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'review': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'confirmed': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'postulating': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'discarded': return 'bg-gray-500/15 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/15 text-gray-400';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'review': return 'En revision';
      case 'confirmed': return 'Confirmada';
      case 'postulating': return 'Postulando';
      case 'discarded': return 'Descartada';
      default: return estado;
    }
  };

  if (oppLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-amber-400 animate-pulse">Cargando licitaciones...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Top bar */}
      <div className="bg-[#111827] border-b border-[#1f2937] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#0a0f1a]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Dashboard de Licitaciones</span>
                <span className="text-xs text-gray-500 ml-3">D&G Constructora</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={runPipeline}
              disabled={pipelineRunning}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
            >
              {pipelineRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {pipelineRunning ? 'Ejecutando...' : 'Run Pipeline'}
            </button>
            <Link to="/" className="text-sm text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pipeline result */}
        {pipelineResult && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${pipelineResult.includes('Error') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
            {pipelineResult}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-dg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Total activas</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
          </div>
          <div className="card-dg p-5 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Alta relevancia</span>
              <Star className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-black text-green-400">{stats.alta || 0}</div>
          </div>
          <div className="card-dg p-5 border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">En postulacion</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">0</div>
          </div>
          <div className="card-dg p-5 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Avg monto</span>
              <Clock className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400">{Math.round(stats.avgMonto / 1000000) || 0}M</div>
          </div>
        </div>

        {/* Filters */}
        <div className="card-dg p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter className="w-4 h-4" />
              Filtros:
            </div>
            
            <select 
              value={filterCat} 
              onChange={(e) => setFilterCat(e.target.value as any)}
              className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Todas las especialidades</option>
              <option value="CONSTRUCCION">Construccion</option>
              <option value="HVAC">Climatizacion</option>
              <option value="MONTAJE">Montaje</option>
            </select>

            <select 
              value={filterPrioridad} 
              onChange={(e) => setFilterPrioridad(e.target.value as any)}
              className="bg-[#0a0f1a] border border-[#1f2937] rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="ALL">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar licitacion..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button 
              onClick={() => { setFilterCat('ALL'); setFilterPrioridad('ALL'); setSearch(''); }}
              className="text-sm text-gray-500 hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" />
              Limpiar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="card-dg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937] bg-[#0a0f1a]">
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Score</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Licitacion</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Categoria</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Prioridad</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Estado</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Subcategoria</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Keywords</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((m: any) => (
                  <tr key={m.id} className="border-b border-[#1f2937]/50 hover:bg-[#0a0f1a]/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold border ${getScoreColor(m.score)}`}>
                        {m.score}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white text-sm">Oportunidad #{m.opportunityId}</div>
                      <div className="text-xs text-gray-500 mt-1">Match ID: {m.id}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${getScoreColor(m.score)}`}>
                        {m.categoriaDg}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${getEstadoBadge(m.prioridad === 'alta' ? 'confirmed' : m.prioridad === 'media' ? 'postulating' : 'discarded')}`}>
                        {m.prioridad?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${getEstadoBadge(m.estado)}`}>
                        {getEstadoLabel(m.estado)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{m.subcategoria}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(m.keywordsMatched || []).slice(0, 3).map((kw: string, i: number) => (
                          <span key={i} className="text-[10px] bg-[#1f2937] text-gray-400 px-2 py-0.5 rounded">{kw}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      No se encontraron licitaciones con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Datos actualizados desde Mercado Publico (ChileCompra). 
          <br />
          El score de relevancia es calculado automaticamente segun palabras clave del perfil D&G.
        </div>
      </div>
    </div>
  );
}
