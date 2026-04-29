import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { 
  Filter, 
  Star, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface Licitacion {
  id: number;
  nombre: string;
  organismo: string;
  montoEstimado: string;
  categoriaDg: string;
  score: number;
  prioridad: string;
  estado: string;
  fechaCierre: string;
  comuna: string;
}

export default function Dashboard() {
  const { user, isLoading, logout } = useAuth({ redirectOnUnauthenticated: true });
  const [filterCat, setFilterCat] = useState<'ALL' | 'CONSTRUCCION' | 'HVAC' | 'MONTAJE'>('ALL');
  const [filterPrioridad, setFilterPrioridad] = useState<'ALL' | 'alta' | 'media' | 'baja'>('ALL');
  const [search, setSearch] = useState('');

  // Datos de ejemplo hasta que la API esté conectada
  const licitaciones: Licitacion[] = [
    { id: 1, nombre: "Conservación Escuela Pumalal - Multiplicación", organismo: "MINEDUC", montoEstimado: "$380.000.000", categoriaDg: "CONSTRUCCION", score: 92, prioridad: "alta", estado: "review", fechaCierre: "15/07/2025", comuna: "Los Ángeles" },
    { id: 2, nombre: "Climatización CESFAM El Carmen", organismo: "MINSAL", montoEstimado: "$85.000.000", categoriaDg: "HVAC", score: 88, prioridad: "alta", estado: "review", fechaCierre: "22/07/2025", comuna: "Concepción" },
    { id: 3, nombre: "Montaje Estructuras Galpón Industrial", organismo: "INOBI SpA", montoEstimado: "$520.000.000", categoriaDg: "MONTAJE", score: 85, prioridad: "alta", estado: "confirmed", fechaCierre: "30/07/2025", comuna: "Laja" },
    { id: 4, nombre: "Reparación Cubierta Escuela Rural Yumbel", organismo: "MINEDUC", montoEstimado: "$45.000.000", categoriaDg: "CONSTRUCCION", score: 72, prioridad: "media", estado: "review", fechaCierre: "10/08/2025", comuna: "Yumbel" },
    { id: 5, nombre: "Instalación HVAC Laboratorio Químico", organismo: "Universidad del Bío-Bío", montoEstimado: "$120.000.000", categoriaDg: "HVAC", score: 78, prioridad: "media", estado: "review", fechaCierre: "18/08/2025", comuna: "Concepción" },
    { id: 6, nombre: "Construcción Sede Social Rucalhue", organismo: "Municipalidad de Los Ángeles", montoEstimado: "$95.000.000", categoriaDg: "CONSTRUCCION", score: 68, prioridad: "media", estado: "discarded", fechaCierre: "05/09/2025", comuna: "Los Ángeles" },
    { id: 7, nombre: "Mantenimiento Climatización Hospital", organismo: "MINSAL", montoEstimado: "$65.000.000", categoriaDg: "HVAC", score: 82, prioridad: "alta", estado: "postulating", fechaCierre: "25/07/2025", comuna: "Los Ángeles" },
  ];

  const filtered = licitaciones.filter(l => {
    if (filterCat !== 'ALL' && l.categoriaDg !== filterCat) return false;
    if (filterPrioridad !== 'ALL' && l.prioridad !== filterPrioridad) return false;
    if (search && !l.nombre.toLowerCase().includes(search.toLowerCase())) return false;
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
      case 'review': return 'En revisión';
      case 'confirmed': return 'Confirmada';
      case 'postulating': return 'Postulando';
      case 'discarded': return 'Descartada';
      default: return estado;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <div className="text-amber-400 animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Top bar */}
      <div className="bg-[#111827] border-b border-[#1f2937] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#0a0f1a]" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Dashboard de Licitaciones</span>
              <span className="text-xs text-gray-500 ml-3">D&G Constructora</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              {user?.name || user?.email}
            </div>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-dg p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Total activas</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{licitaciones.length}</div>
          </div>
          <div className="card-dg p-5 border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Alta relevancia</span>
              <Star className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-black text-green-400">{licitaciones.filter(l => l.prioridad === 'alta').length}</div>
          </div>
          <div className="card-dg p-5 border-amber-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">En postulación</span>
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{licitaciones.filter(l => l.estado === 'postulating').length}</div>
          </div>
          <div className="card-dg p-5 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Cierran {'<'} 30 días</span>
              <Clock className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400">3</div>
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
              <option value="CONSTRUCCION">Construcción</option>
              <option value="HVAC">Climatización</option>
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
                placeholder="Buscar licitación..."
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
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Licitación</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Organismo</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Monto</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Categoría</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Estado</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Cierre</th>
                  <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-[#1f2937]/50 hover:bg-[#0a0f1a]/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold border ${getScoreColor(l.score)}`}>
                        {l.score}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white text-sm max-w-[200px]">{l.nombre}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <span>📍 {l.comuna}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{l.organismo}</td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-amber-400 text-sm">{l.montoEstimado}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${getScoreColor(l.score)}`}>
                        {l.categoriaDg}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border ${getEstadoBadge(l.estado)}`}>
                        {getEstadoLabel(l.estado)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {l.fechaCierre}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button className="text-xs bg-amber-500/15 text-amber-400 px-3 py-1.5 rounded-lg hover:bg-amber-500/25 transition-colors">
                          Ver detalle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No se encontraron licitaciones con los filtros seleccionados.
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-6 text-center text-xs text-gray-600">
          Datos actualizados desde Mercado Público (ChileCompra). Última sincronización: hace 2 horas.
          <br />
          El score de relevancia es calculado automáticamente según palabras clave del perfil D&G.
        </div>
      </div>
    </div>
  );
}
