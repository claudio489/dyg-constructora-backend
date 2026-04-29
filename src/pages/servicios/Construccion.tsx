import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Construccion() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      {/* Hero SEO */}
      <section className="pt-28 pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-amber-400 mb-4">
            <Building2 className="w-4 h-4" />
            <span>Servicios / Construcción Industrial</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
            Construcción industrial en la <span className="gradient-gold-text">Región del Biobío</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mb-8">
            Obras públicas y privadas con 8+ años de experiencia. Especialistas en infraestructura educativa, 
            sedes comunitarias, obras municipales e industrial. 60.000+ m² ejecutados y 3.105 días sin accidentes.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#contacto" className="btn-gold">Solicitar cotización</a>
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
            { value: '60.000+', label: 'm² construidos' },
            { value: '20+', label: 'proyectos finalizados' },
            { value: '3.105', label: 'días sin accidentes' },
            { value: '100%', label: 'obras a tiempo' },
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
          <h2 className="text-2xl font-bold text-white mb-8">Especialidades de construcción</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Obra gruesa y civil', desc: 'Cimentaciones, estructuras de hormigón, muros, losas, vigas. Desde fundaciones hasta estructuras completas para edificaciones de hasta 3 pisos.' },
              { title: 'Infraestructura educativa', desc: 'Conservación y reparación de escuelas para MINEDUC. Obras de obra civil completa: cubiertas, muros, pavimentos, instalaciones y terminaciones.' },
              { title: 'Obras municipales', desc: 'Sedes comunitarias, plazas públicas, remodelación de edificios municipales. Cumplimiento normativo y plazos exigidos por organismos públicos.' },
              { title: 'Terminaciones', desc: 'Pintura, cierres, pavimentos interiores, instalaciones sanitarias y eléctricas. Acabados de calidad para entrega final al mandante.' },
            ].map((s, i) => (
              <div key={i} className="card-dg p-6 flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proyectos destacados */}
      <section className="pb-16 section-padding">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8">Proyectos de construcción ejecutados</h2>
          <div className="space-y-4">
            {[
              { name: 'Conservación Escuela El Nogal - Los Ángeles', monto: '$449.990.032', m2: '7.861 m²', mandante: 'MINEDUC', desc: 'Conservación integral de escuela con obra civil completa. Cubierta, muros, pavimentos, instalaciones y terminaciones.' },
              { name: 'Municipalidad de Ercilla (Ex-Internado)', monto: '$248.350.652', m2: '610 m²', mandante: 'Municipalidad de Ercilla', desc: 'Remodelación integral del ex-internado para edificio consistorial municipal. EMA 2020 habilitación.' },
              { name: 'Plazas Héroes de Chile - Hualqui', monto: '$99.831.358', m2: '3.000 m²', mandante: 'Municipalidad de Hualqui', desc: 'Construcción y mejoramiento de plazas públicas. Mobiliario urbano, iluminación y áreas verdes.' },
            ].map((p, i) => (
              <div key={i} className="card-dg p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white">{p.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.mandante}</span>
                    <span>{p.m2}</span>
                  </div>
                </div>
                <div className="text-xl font-black gradient-gold-text whitespace-nowrap">{p.monto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificaciones obra pública */}
      <section className="pb-16 section-padding bg-[#070b14]">
        <div className="max-w-5xl mx-auto card-dg p-8 border-l-4 border-amber-500">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Habilitados para obra pública</h2>
          </div>
          <p className="text-gray-400 mb-4">
            Registro de Proveedores del Estado (RUP) vigente hasta 11/03/2026. 
            Empresa constructora registrada DOM. Inscritos en el Registro de Contratistas del MOP.
          </p>
          <div className="flex flex-wrap gap-2">
            {['RUP Vigente 2026', 'Registro MOP', 'Certificación DOM', 'SENCE', 'Plan de Integridad'].map((tag, i) => (
              <span key={i} className="text-xs bg-[#0a0f1a] text-amber-400 px-3 py-1.5 rounded-full border border-[#1f2937]">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
