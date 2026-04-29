import { ShieldCheck, Award, Users, Calendar, HardHat, FileCheck, CheckCircle2 } from 'lucide-react';

export default function Autoridad() {
  const certificaciones = [
    { icon: FileCheck, label: 'Registro RUP', value: 'Vigente hasta 11/03/2026', status: 'Activo' },
    { icon: Award, label: 'Código SAP CMPC', value: '133764', status: 'Activo' },
    { icon: ShieldCheck, label: 'Certificación SENCE', value: 'Capacitación', status: 'Activo' },
    { icon: ShieldCheck, label: 'Certificación ACHS', value: 'Seguridad', status: 'Activo' },
  ];

  const kpis = [
    { value: '8+', label: 'Años de experiencia', icon: Calendar },
    { value: '60.000+', label: 'm² construidos', icon: HardHat },
    { value: '3.105', label: 'Días sin accidentes', icon: ShieldCheck },
    { value: '22', label: 'Trabajadores', icon: Users },
    { value: '20+', label: 'Proyectos finalizados', icon: FileCheck },
    { value: '98%', label: 'Satisfacción cliente', icon: CheckCircle2 },
  ];

  const equipo = [
    { initials: 'LG', name: 'Luis Hernán Godoy Muñoz', role: 'Ing. Constructor', sub: 'Director de Proyectos' },
    { initials: 'JU', name: 'Jerson Patricio Urriola Núñez', role: 'Ing. Constructor', sub: 'Supervisor y Director de Licitaciones' },
    { initials: 'NM', name: 'Nicole Valeska Muñoz Araneda', role: 'Psicóloga', sub: 'Recursos Humanos' },
    { initials: 'CL', name: 'Claudio Lavín Ortega', role: 'Prevencionista', sub: 'Prevención de Riesgos' },
    { initials: 'MM', name: 'Michael Eduardo Melo Aceitón', role: 'Ing. Electricista', sub: 'Instalaciones' },
    { initials: 'LP', name: 'Luis Andrés Poblete Newman', role: 'Arquitecto', sub: 'Diseño y Planificación' },
  ];

  return (
    <section id="nosotros" className="section-padding py-20 bg-[#070b14]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <Award className="w-4 h-4" />
            Autoridad y Confianza
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            ¿Por qué <span className="gradient-gold-text">elegirnos?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Indicadores que respaldan nuestra capacidad de ejecución. Certificaciones vigentes, 
            equipo experto y un historial comprobado de cumplimiento de plazos.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {kpis.map((kpi, i) => (
            <div key={i} className="card-dg p-5 text-center space-y-2">
              <kpi.icon className="w-6 h-6 text-amber-500 mx-auto" />
              <div className="text-2xl font-black gradient-gold-text">{kpi.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</div>
            </div>
          ))}
        </div>

        {/* Certificaciones */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Certificaciones vigentes</h3>
            <div className="space-y-4">
              {certificaciones.map((cert, i) => (
                <div key={i} className="card-dg p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <cert.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{cert.label}</span>
                      <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">{cert.status}</span>
                    </div>
                    <p className="text-sm text-gray-400">{cert.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card-dg p-5 mt-4 border-l-4 border-amber-500">
              <p className="text-sm text-gray-400">
                <span className="text-amber-400 font-semibold">Plan de Integridad</span> ·{' '}
                <span className="text-amber-400 font-semibold">Plan de Medio Ambiente</span> ·{' '}
                <span className="text-amber-400 font-semibold">800+ m³ andamios multidireccionales certificados</span>
              </p>
            </div>
          </div>

          {/* Equipo */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Equipo ejecutivo</h3>
            <div className="grid grid-cols-2 gap-3">
              {equipo.map((m, i) => (
                <div key={i} className="card-dg p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-[#0a0f1a] font-bold text-xs flex-shrink-0">
                    {m.initials}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs truncate">{m.name}</h4>
                    <p className="text-[10px] text-amber-400">{m.role}</p>
                    <p className="text-[10px] text-gray-500">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
