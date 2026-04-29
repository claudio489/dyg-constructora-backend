import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Wind, Thermometer, CheckCircle2, Zap, Building2 } from 'lucide-react';

export default function Climatizacion() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      {/* Hero SEO */}
      <section className="pt-28 pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-cyan-400 mb-4">
            <Wind className="w-4 h-4" />
            <span>Servicios / Climatización Integral</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Climatización industrial y HVAC en <span className="gradient-gold-text">Concepción y el Biobío</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Especialistas en eficiencia energética para industrias, centros de salud y educación. 
            Tecnología Inverter que reduce hasta un 40% el gasto energético. 55+ proyectos ejecutados en 2024.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contacto" className="btn-gold">Cotizar sistema HVAC</a>
            <a href="/" className="px-6 py-3 rounded-full border border-[#1f2937] text-gray-400 hover:text-amber-400 transition-colors">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: '55+', label: 'proyectos 2024' },
            { value: '40%', label: 'ahorro energético' },
            { value: '90.000', label: 'BTU máx. instalados' },
            { value: '3.105', label: 'días sin accidentes' },
          ].map((s, i) => (
            <div key={i} className="card-dg p-6 text-center">
              <div className="text-2xl font-black gradient-gold-text">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problemática energética del sur */}
      <section className="pb-16 section-padding bg-[#070b14]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Los altos costos energéticos <span className="gradient-gold-text">tensionan a las industrias del sur</span>
              </h2>
              <p className="text-gray-400 mb-4">
                La Región del Biobío tiene algunos de los costos eléctricos más altos de Chile. 
                Las industrias dedican hasta un 30% de sus gastos operativos a climatización y calefacción.
              </p>
              <ul className="space-y-3">
                {[
                  'Tarifas eléctricas en aumento constante',
                  'Sistemas obsoletos consumen 2-3x más energía',
                  'Multas por incumplimiento normativa térmica',
                  'Pérdida de productividad por mal clima interior',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                    <span className="text-red-400 mt-0.5">✕</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-dg p-8 border-cyan-500/20">
              <Zap className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">La solución D&G HVAC</h3>
              <ul className="space-y-3">
                {[
                  'Tecnología Inverter: reduce consumo un 40%',
                  'Sistemas dimensionados a la medida de su espacio',
                  'Mantenimiento preventivo incluido',
                  'Cumplimiento normativa térmica OPC/CIE',
                  'Financiamiento disponible',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de sistemas */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Sistemas que instalamos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Split Muro Inverter', desc: 'Para oficinas, salas de espera y habitaciones. Capacidad 9.000 - 36.000 BTU. Control remoto inteligente.' },
              { title: 'Piso Cielo', desc: 'Ideal para locales comerciales y áreas de circulación. Distribución uniforme del aire.' },
              { title: 'Ductos Centralizados', desc: 'Para edificios completos. Un solo equipo climatiza múltiples ambientes vía ductería.' },
              { title: 'Cassette 4 vías', desc: 'Para salones amplios, oficinas open space. Distribución en 4 direcciones.' },
              { title: 'Multi Split', desc: 'Una unidad exterior alimenta 2-5 interiores. Ideal cuando el espacio exterior es limitado.' },
              { title: 'Ventilación Industrial', desc: 'Extractoras, inyectores, sistemas de renovación de aire para industria y laboratorios.' },
            ].map((s, i) => (
              <div key={i} className="card-dg p-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                  <Thermometer className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos HVAC */}
      <section className="pb-16 section-padding bg-[#070b14]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Proyectos HVAC ejecutados</h2>
          <div className="space-y-4">
            {[
              { name: 'CESFAM Antuco + PSR Los Canelos', monto: '$116.125.674', detail: '1.138,40 m² · Split Inverter · MINSAL', desc: 'Climatización integral de centro de salud familiar rural. Instalación de sistemas split inverter de alta eficiencia.' },
              { name: 'Lab Sala Fibra - CMPC Pulp Laja', monto: '$101.150.000', detail: 'Planta Laja · 160 días · Ventilación', desc: 'Climatización y ventilación de precisión para laboratorio de fibra celulósica. Control de temperatura y humedad estricto.' },
              { name: 'Hospital de Los Ángeles', monto: '$50.000.000', detail: '90.000 BTU · Split/Ducto/Piso cielo · MINSAL', desc: 'Instalación de sistemas HVAC de alta capacidad para áreas críticas del hospital. Múltiples tecnologías según requerimiento de cada espacio.' },
            ].map((p, i) => (
              <div key={i} className="card-dg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <span className="text-lg font-black gradient-gold-text">{p.monto}</span>
                </div>
                <p className="text-sm text-gray-400 mb-2">{p.desc}</p>
                <span className="text-xs text-gray-500">{p.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectores */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto card-dg p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Sectores que atendemos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Industria', 'Centros de Salud', 'Educación', 'Comercio', 'Oficinas', 'Hospitales', 'Laboratorios', 'Residencial'].map((s, i) => (
              <div key={i} className="bg-[#0a0f1a] rounded-xl p-4 text-center text-sm text-gray-300 border border-[#1f2937]">
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
