import { Phone, Mail, Globe, MapPin, Send, Building2 } from 'lucide-react';

export default function Contacto() {
  return (
    <section id="contacto" className="section-padding py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="badge-gold inline-flex items-center gap-2 mb-4">
            <Send className="w-4 h-4" />
            Contacto
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Solicite una <span className="gradient-gold-text">evaluación de proyecto</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cuéntenos sobre su proyecto. Evaluamos alcance, plazo y presupuesto en 24 horas hábiles. 
            Especialistas en obras públicas, industriales y climatización.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="card-dg p-8">
            <h3 className="text-lg font-bold text-white mb-6">Formulario de cotización</h3>
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Nombre completo *</label>
                  <input type="text" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Empresa *</label>
                  <input type="text" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="Nombre de la empresa" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Email *</label>
                  <input type="email" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="correo@empresa.cl" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Teléfono / WhatsApp</label>
                  <input type="tel" className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="+56 9 0000 0000" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Tipo de proyecto</label>
                  <select className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none">
                    <option>Seleccione...</option>
                    <option>Construcción nueva</option>
                    <option>Remodelación / Conservación</option>
                    <option>Climatización (HVAC)</option>
                    <option>Montaje industrial</option>
                    <option>Multiservicio integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Presupuesto estimado</label>
                  <select className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none">
                    <option>Seleccione...</option>
                    <option>$50M - $100M</option>
                    <option>$100M - $250M</option>
                    <option>$250M - $500M</option>
                    <option>$500M - $1.000M</option>
                    <option>Más de $1.000M</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Descripción del proyecto</label>
                <textarea rows={4} className="w-full bg-[#0a0f1a] border border-[#1f2937] rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none resize-none" placeholder="Describa el proyecto: ubicación, m² estimados, tipo de obra, plazo esperado..." />
              </div>

              <button type="submit" className="btn-gold w-full flex items-center justify-center gap-2">
                <Send className="w-5 h-5" />
                Enviar solicitud de evaluación
              </button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="card-dg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono / WhatsApp</p>
                    <p className="font-bold text-white">+56 9 4031 0086</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Correo electrónico</p>
                    <p className="font-bold text-white">contacto@dygconstructora.cl</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sitio web</p>
                    <p className="font-bold text-white">www.dygconstructora.cl</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Oficina central</p>
                    <p className="font-bold text-white">Los Ángeles, Región del Biobío, Chile</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-dg p-6 border-l-4 border-amber-500">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-white">D&G Constructora SPA</h4>
              </div>
              <p className="text-sm text-gray-400 mb-3">
                RUT: 76.694.278-4 · Los Ángeles, Región del Biobío · Cobertura Nacional
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-[#0a0f1a] text-gray-400 px-2 py-1 rounded-full border border-[#1f2937]">RUP vigente 2026</span>
                <span className="text-xs bg-[#0a0f1a] text-gray-400 px-2 py-1 rounded-full border border-[#1f2937]">SAP CMPC 133764</span>
                <span className="text-xs bg-[#0a0f1a] text-gray-400 px-2 py-1 rounded-full border border-[#1f2937]">SENCE</span>
                <span className="text-xs bg-[#0a0f1a] text-gray-400 px-2 py-1 rounded-full border border-[#1f2937]">ACHS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
