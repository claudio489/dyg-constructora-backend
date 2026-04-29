import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Factory, ArrowRight, CheckCircle2, Wind } from 'lucide-react';

export default function Montaje() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      {/* Hero SEO */}
      <section className="pt-28 pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-amber-400 mb-4">
            <Factory className="w-4 h-4" />
            <span>Servicios / Montaje Industrial</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Montaje industrial y estructuras metálicas en <span className="gradient-gold-text">Chile</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Laboratorios CMPC, silos de almacenamiento, estructuras metálicas de gran porte 
            y montaje para energías renovables. Izaje controlado, soldadura certificada y 
            800+ m³ de andamios multidireccionales certificados.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contacto" className="btn-gold">Cotizar montaje</a>
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
            { value: '800+', label: 'm³ andamios certificados' },
            { value: '$430M', label: 'mayor proyecto montaje' },
            { value: '0', label: 'accidentes en montajes' },
            { value: 'SAP', label: 'Código CMPC 133764' },
          ].map((s, i) => (
            <div key={i} className="card-dg p-6 text-center">
              <div className="text-2xl font-black gradient-gold-text">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios detallados */}
      <section className="pb-16 section-padding bg-[#070b14]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Capacidades de montaje</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Silos y estructuras de almacenamiento', desc: 'Ensamblaje estructural completo: recepción, verificación, izaje controlado, montaje por etapas de virolas, alineación, aplome, pernos de alta resistencia con torque controlado.' },
              { title: 'Laboratorios industriales', desc: 'Montaje de laboratorios para industria pulp y papel (CMPC). Instalación de equipos de precisión, mesadas, campanas extractoras y sistemas de climatización especializada.' },
              { title: 'Estructuras metálicas', desc: 'Fabricación y montaje de estructuras metálicas de acero y aluminio. Galpones, coberturas, plataformas, pasarelas y soportes para equipos industriales.' },
              { title: 'Andamios certificados', desc: '800+ m³ de andamios multidireccionales certificados. Montaje de plataformas de trabajo seguras para altura, cumpliendo normativa de seguridad.' },
            ].map((s, i) => (
              <div key={i} className="card-dg p-6">
                <CheckCircle2 className="w-5 h-5 text-amber-400 mb-3" />
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Energía Eólica - NUEVA SECCIÓN */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="card-dg p-8 lg:p-10 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <Wind className="w-8 h-8 text-emerald-400" />
                <h2 className="text-2xl font-bold text-white">Energía Eólica — Sector Emergente</h2>
              </div>
              <p className="text-gray-400 mb-6 max-w-3xl">
                El Plan de Fortalecimiento Industrial del Biobío prioriza el desarrollo de proveedores locales 
                para parques eólicos. D&G tiene la capacidad técnica para el montaje de torres, nacelles y 
                componentes estructurales de aerogeneradores.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { title: 'Montaje de torres', desc: 'Ensamblaje seccional de torres de acero hasta 120m de altura.' },
                  { title: 'Cimentaciones', desc: 'Obra civil para bases de hormigón armado de aerogeneradores.' },
                  { title: 'Mantenimiento', desc: 'Servicios de conservación y reparación de infraestructura eólica.' },
                ].map((e, i) => (
                  <div key={i} className="bg-[#0a0f1a] rounded-xl p-4 border border-[#1f2937]">
                    <h4 className="font-bold text-emerald-400 text-sm mb-1">{e.title}</h4>
                    <p className="text-xs text-gray-400">{e.desc}</p>
                  </div>
                ))}
              </div>
              <a href="#contacto" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                Consultar capacidad para proyectos eólicos
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos montaje */}
      <section className="pb-16 section-padding bg-[#070b14]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Proyectos de montaje ejecutados</h2>
          <div className="space-y-4">
            {[
              { name: 'Montaje Industrial de Silos - INOBI SpA', monto: '$430.000.000', detail: '485 m³ andamios · Torque controlado · Los Ángeles', desc: 'Ensamblaje estructural completo de silos de almacenamiento. Recepción, verificación, izaje controlado, montaje por etapas de virolas, alineación y aplome.' },
              { name: 'Laboratorio Sala Fibra - CMPC Pulp', monto: '$101.150.000', detail: 'Planta Laja · 160 días · SAP 133764', desc: 'Montaje de infraestructura de laboratorio con climatización de precisión. Trabajo en planta industrial operativa.' },
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

      {/* CTA */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto text-center card-dg p-10 border-amber-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            ¿Tiene un proyecto de montaje industrial?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Evaluamos su proyecto en 24 horas. Especialistas en estructuras metálicas, 
            silos y montaje industrial con código SAP CMPC 133764.
          </p>
          <a href="#contacto" className="btn-gold inline-flex items-center gap-2">
            Solicitar evaluación técnica
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
