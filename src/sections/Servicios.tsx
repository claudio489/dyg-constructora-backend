import { HardHat, ArrowRight, Building2, Wind, Factory, Wrench } from 'lucide-react';

export default function Servicios() {
  const servicios = [
    {
      icon: Building2,
      image: '/proyectos/servicio-construccion.webp',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      title: 'Construcción Industrial',
      subtitle: 'Obras públicas y privadas',
      metric: '60.000+ m²',
      metricLabel: 'construidos',
      description: 'Obras menores y mayores. Infraestructura industrial, obra gruesa, estructuras, tabiquería, instalaciones y terminaciones. Desde conservación de escuelas hasta plazas públicas y sedes comunitarias.',
      tags: ['Obra gruesa', 'Infraestructura educativa', 'Obras públicas', 'Terminaciones'],
      cta: 'Ver obras de construcción',
    },
    {
      icon: Wind,
      image: '/proyectos/servicio-climatizacion.webp',
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      title: 'Climatización Integral',
      subtitle: 'HVAC — Especialistas en eficiencia energética',
      metric: '55+ proyectos',
      metricLabel: 'en 2024',
      description: 'Sistemas de climatización doméstica e industrial. Aires acondicionados, calefacción, ventilación y bombas de calor. Tecnología Inverter para reducir hasta un 40% el gasto energético en industrias del sur.',
      tags: ['Split Inverter', 'Piso cielo', 'Ductos', 'Ventilación industrial'],
      cta: 'Ver proyectos HVAC',
      destacado: true,
    },
    {
      icon: Factory,
      image: '/proyectos/montaje-silos.webp',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      title: 'Montaje Industrial',
      subtitle: 'Estructuras metálicas y silos',
      metric: '800+ m³',
      metricLabel: 'andamios certificados',
      description: 'Laboratorios CMPC, silos de almacenamiento, estructuras metálicas de gran porte. Izaje controlado, soldadura certificada, torque controlado y andamios multidireccionales certificados.',
      tags: ['Silos', 'Laboratorios', 'Estructuras metálicas', 'Energía eólica'],
      cta: 'Ver montajes industriales',
    },
  ];

  return (
    <section id="servicios" className="section-padding py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <HardHat className="w-4 h-4" />
            Servicios
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Tres especialidades, <span className="gradient-gold-text">un solo contrato</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            El único equipo en la Región del Biobío que ejecuta construcción, climatización y montaje industrial 
            bajo un mismo contrato. Reducimos costos de coordinación y acortamos plazos.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {servicios.map((s, i) => (
            <div
              key={i}
              className={`card-dg p-8 relative overflow-hidden group hover:border-amber-500/40 transition-all duration-300 ${
                s.destacado ? 'border-amber-500/30 ring-1 ring-amber-500/20' : ''
              }`}
            >
              {s.destacado && (
                <div className="absolute top-4 right-4 badge-gold text-[10px] py-1 px-3 z-10">
                  Más demandado
                </div>
              )}

              {s.image && (
                <div className="h-32 -mx-8 -mt-8 mb-6 overflow-hidden rounded-t-2xl">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl ${s.iconBg} flex items-center justify-center mb-6`}>
                <s.icon className={`w-7 h-7 ${s.iconColor}`} />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{s.subtitle}</p>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-black gradient-gold-text">{s.metric}</span>
                <span className="text-xs text-gray-500 uppercase">{s.metricLabel}</span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed mb-6">{s.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {s.tags.map((tag, j) => (
                  <span key={j} className="text-xs bg-[#0a0f1a] text-gray-400 px-3 py-1.5 rounded-full border border-[#1f2937]">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="#proyectos" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group-hover:gap-3">
                {s.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Banner de integración */}
        <div className="mt-12 card-dg p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-6 h-6 text-[#0a0f1a]" />
            </div>
            <div>
              <h4 className="font-bold text-white">¿Necesita más de una especialidad?</h4>
              <p className="text-sm text-gray-400">
                D&G es uno de los pocos players en el Biobío que ofrece las 3 especialidades en un solo contrato.
              </p>
            </div>
          </div>
          <a href="#contacto" className="btn-gold whitespace-nowrap">
            Cotizar proyecto multiservicio
          </a>
        </div>
      </div>
    </section>
  );
}
