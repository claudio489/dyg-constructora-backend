import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight, ShieldCheck, FileCheck, AlertTriangle } from 'lucide-react';

export default function NormativaSalud() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      <section className="pt-28 pb-12 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="text-cyan-400">Blog / Normativa</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />3 Abril 2025</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            Normativa de climatización para <span className="gradient-gold-text">centros de salud en Chile</span>
          </h1>
          <p className="text-lg text-gray-400">
            Guía técnica sobre los requisitos de climatización para hospitales, CESFAM, consultorios 
            y laboratorios según normativa chilena vigente.
          </p>
        </div>
      </section>

      <article className="pb-16 section-padding">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Alert */}
          <div className="card-dg p-6 border-l-4 border-amber-500 bg-amber-500/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-amber-400 mb-2">Importante para centros de salud</h3>
                <p className="text-sm text-gray-400">
                  La Ordenanza General de Urbanismo y Construcciones (OGUC) y el D.S. N° 594/99 del Ministerio de Salud 
                  establecen requisitos técnicos obligatorios de climatización para establecimientos de salud. 
                  El incumplimiento puede generar multas y cierre del establecimiento.
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              Requisitos técnicos por tipo de espacio
            </h2>
            <div className="space-y-4">
              {[
                { 
                  area: 'Quirofano / Sala de procedimientos', 
                  temp: '20-24°C', 
                  humedad: '45-60%',
                  renovacion: '20 renovaciones/hora mínimo',
                  obs: 'Sistema de filtración HEPA obligatorio. Presión positiva respecto a áreas adyacentes.'
                },
                { 
                  area: 'Hospitalización / Pabellón', 
                  temp: '22-26°C', 
                  humedad: '40-70%',
                  renovacion: '6 renovaciones/hora',
                  obs: 'Control individual por sala. Sistema silencioso (máx 35 dB).' 
                },
                { 
                  area: 'UCI / Unidad de Cuidados Intensivos', 
                  temp: '22-24°C', 
                  humedad: '45-55%',
                  renovacion: '15 renovaciones/hora',
                  obs: 'Monitoreo continuo de temperatura y humedad. Sistema redundante (backup).' 
                },
                { 
                  area: 'Laboratorio clínico', 
                  temp: '20-25°C', 
                  humedad: '< 60%',
                  renovacion: '10 renovaciones/hora',
                  obs: 'Control estricto de humedad para preservar reactivos. Compatibilidad con campanas extractoras.' 
                },
                { 
                  area: 'Farmacia / Bodega de medicamentos', 
                  temp: '15-25°C', 
                  humedad: '< 60%',
                  renovacion: '4 renovaciones/hora',
                  obs: 'Cumplimiento normativa ISP para almacenamiento de medicamentos termolábiles.' 
                },
                { 
                  area: 'Sala de espera / Admisión', 
                  temp: '22-26°C', 
                  humedad: '40-70%',
                  renovacion: '4 renovaciones/hora',
                  obs: 'Sistema de filtración para control de patógenos aéreos.' 
                },
              ].map((req, i) => (
                <div key={i} className="card-dg p-6">
                  <h3 className="font-bold text-white mb-3">{req.area}</h3>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block">Temperatura</span>
                      <span className="text-sm font-bold text-amber-400">{req.temp}</span>
                    </div>
                    <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block">Humedad</span>
                      <span className="text-sm font-bold text-cyan-400">{req.humedad}</span>
                    </div>
                    <div className="bg-[#0a0f1a] rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block">Renovación</span>
                      <span className="text-sm font-bold text-green-400">{req.renovacion}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{req.obs}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="card-dg p-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              Certificaciones que exige la normativa
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Certificación del instalador por entidad acreditada (SEC)',
                'Protocolo de puesta en marcha con mediciones',
                'Mantenimiento preventivo semestral documentado',
                'Monitoreo continuo con registro de temperatura/humedad',
                'Plan de contingencia ante falla del sistema',
                'Validación IQ/OQ/PQ para áreas críticas',
              ].map((cert, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-400">{cert}</span>
                </div>
              ))}
            </div>
          </div>

          {/* D&G advantage */}
          <div className="card-dg p-8 border-l-4 border-amber-500">
            <h2 className="text-xl font-bold text-white mb-4">D&G: Experiencia en climatización de salud</h2>
            <p className="text-gray-400 mb-4">
              Hemos ejecutado proyectos HVAC para <strong className="text-white">MINSAL, Servicio Salud Biobío y municipalidades</strong>, 
              incluyendo CESFAM Antuco (+1.138 m²), Hospital de Los Ángeles (90.000 BTU) y 
              Laboratorios CMPC Pulp Laja.
            </p>
            <div className="flex flex-wrap gap-2">
              {['CESFAM Antuco', 'Hospital Los Ángeles', 'Lab CMPC Laja', 'RUP Vigente', 'Certificación SEC'].map((tag, i) => (
                <span key={i} className="text-xs bg-[#0a0f1a] text-amber-400 px-3 py-1.5 rounded-full border border-[#1f2937]">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center card-dg p-8">
            <h3 className="text-xl font-bold text-white mb-3">¿Necesita climatizar un centro de salud?</h3>
            <p className="text-gray-400 mb-6">Cumplimiento normativo garantizado. Presupuesto en 24 horas.</p>
            <a href="/contacto" className="btn-gold inline-flex items-center gap-2">
              Cotizar proyecto de salud
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
