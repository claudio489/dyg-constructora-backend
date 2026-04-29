import { useEffect, useState } from 'react';
import { Bell, TrendingUp, Target, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DashboardTeaser() {
  const [stats, setStats] = useState({ total: 0, publicadas: 0, matches: 0, altaRelevancia: 0 });

  useEffect(() => {
    // Static fallback values until API is live
    setStats({
      total: 147,
      publicadas: 23,
      matches: 18,
      altaRelevancia: 6,
    });
  }, []);

  return (
    <section className="section-padding py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" />
            Inteligencia de Licitaciones
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Oportunidades de obra pública y privada{' '}
            <span className="gradient-gold-text">en tiempo real</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Nuestro sistema escanea Mercado Público y filtra licitaciones relevantes para su perfil. 
            Identificamos oportunidades de construcción, climatización y montaje industrial antes que la competencia.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="card-dg p-6 text-center">
            <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 uppercase">Licitaciones monitoreadas</div>
          </div>
          <div className="card-dg p-6 text-center">
            <Target className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.publicadas}</div>
            <div className="text-xs text-gray-500 uppercase">Activas esta semana</div>
          </div>
          <div className="card-dg p-6 text-center">
            <ShieldCheck className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.matches}</div>
            <div className="text-xs text-gray-500 uppercase">Match con D&G</div>
          </div>
          <div className="card-dg p-6 text-center border-amber-500/30">
            <Clock className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-black text-white">{stats.altaRelevancia}</div>
            <div className="text-xs text-gray-500 uppercase">Alta relevancia</div>
          </div>
        </div>

        <div className="card-dg p-8 lg:p-12 text-center border-amber-500/20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-3">
              Acceda al dashboard completo de licitaciones
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Dashboard privado con filtros por especialidad, monto, plazo y score de relevancia. 
              Alertas automáticas cuando aparecen licitaciones que coinciden con su perfil. 
              Requiere validación de empresa.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/login" className="btn-gold inline-flex items-center gap-2">
                Solicitar acceso al dashboard
                <ArrowRight className="w-5 h-5" />
              </a>
              <span className="text-xs text-gray-500 flex items-center">
                Acceso gratuito para clientes y aliados estratégicos de D&G
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
