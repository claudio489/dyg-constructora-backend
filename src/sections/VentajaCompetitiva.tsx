import { Layers, Zap, FileCheck, Users, ArrowRight } from 'lucide-react';

export default function VentajaCompetitiva() {
  const problemas = [
    'Coordinar 3 contratistas retrasa plazos un 35%',
    'Cada interfaz es un punto de fallo de calidad',
    'Facturas duplicadas y costos ocultos de coordinación',
    'Responsabilidad difusa cuando algo falla',
  ];

  const soluciones = [
    { icon: FileCheck, title: 'Un solo contrato', desc: 'Una factura, un solo responsable legal, un solo plazo de entrega.' },
    { icon: Zap, title: 'Reducción de costos', desc: 'Eliminamos costos de interfaz. Optimizamos recursos entre especialidades.' },
    { icon: Layers, title: 'Calidad integral', desc: 'Construcción, HVAC y montaje diseñados como sistema, no como silos.' },
    { icon: Users, title: 'Equipo dedicado', desc: '22 trabajadores calificados, prevencionista de riesgos propio, sin subcontratistas externos.' },
  ];

  return (
    <section className="section-padding py-20 bg-[#070b14]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" />
            Ventaja Competitiva
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            ¿Por qué las grandes industrias del Biobío{' '}
            <span className="gradient-gold-text">eligen el modelo multiservicio D&G?</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            La mayoría de las obras complejas requieren contratar constructor, instalador HVAC y montajista por separado. 
            Eso genera retrasos, costos ocultos y responsabilidad difusa.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Problema */}
          <div className="card-dg p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 text-sm">✕</span>
              Coordinar múltiples proveedores
            </h3>
            <ul className="space-y-4">
              {problemas.map((p, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400">
                  <span className="mt-1 w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center text-red-400 text-xs flex-shrink-0">✕</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Solución */}
          <div className="card-dg p-8 border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-400 text-sm">✓</span>
              D&G Multiservicio B2B
            </h3>
            <div className="space-y-5">
              {soluciones.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{s.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA intermedio */}
        <div className="card-dg p-8 lg:p-12 text-center border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent">
          <blockquote className="text-xl sm:text-2xl font-semibold text-white italic max-w-3xl mx-auto mb-6">
            "Al contratar a D&G como multiservicio, elimina la necesidad de coordinar múltiples proveedores, 
            reduce riesgos de interfaz y obtiene <span className="gradient-gold-text">una sola factura, un solo responsable, un solo plazo</span>."
          </blockquote>
          <a href="#contacto" className="btn-gold inline-flex items-center gap-2">
            Solicitar evaluación de proyecto multiservicio
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
