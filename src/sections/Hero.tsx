import { ShieldCheck, Clock, Building2, HardHat } from 'lucide-react';

export default function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.webp" 
          alt="" 
          className="w-full h-full object-cover opacity-15"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1a]/95 via-[#0a0f1a]/85 to-[#0a0f1a]/70" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a0f1a] to-transparent" />
      </div>

      <div className="relative z-10 section-padding max-w-7xl mx-auto w-full py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="badge-gold inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              3.105 días sin accidentes
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Liderando la{' '}
              <span className="gradient-gold-text">infraestructura industrial</span>{' '}
              del Biobío con soluciones{' '}
              <span className="text-white">multiservicio integrales</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-xl">
              <strong className="text-white">Construcción + Climatización + Montaje Industrial</strong>{' '}
              en un solo contrato. Una sola factura, un solo responsable, un solo plazo.{' '}
              Eliminamos la complejidad de coordinar múltiples proveedores en obras complejas.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#contacto" className="btn-gold">
                Solicitar evaluación de proyecto
              </a>
              <a href="#servicios" className="px-8 py-4 rounded-full border-2 border-[#1f2937] text-gray-300 font-semibold hover:border-amber-500/50 hover:text-amber-400 transition-all">
                Conocer servicios
              </a>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                RUP vigente hasta 2026
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Building2 className="w-4 h-4 text-amber-500" />
                Código SAP CMPC: 133764
              </div>
            </div>
          </div>

          {/* Right: KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card-dg p-6 text-center space-y-2">
              <HardHat className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="text-3xl font-black gradient-gold-text">60.000+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">m² ejecutados</div>
            </div>
            <div className="card-dg p-6 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="text-3xl font-black gradient-gold-text">3.105</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">días sin accidentes</div>
            </div>
            <div className="card-dg p-6 text-center space-y-2">
              <Clock className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="text-3xl font-black gradient-gold-text">8+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">años de trayectoria</div>
            </div>
            <div className="card-dg p-6 text-center space-y-2">
              <Building2 className="w-8 h-8 text-amber-500 mx-auto" />
              <div className="text-3xl font-black gradient-gold-text">55+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">proyectos HVAC 2024</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
