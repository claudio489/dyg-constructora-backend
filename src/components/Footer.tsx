export default function Footer() {
  return (
    <footer className="border-t border-[#1f2937] bg-[#070b14]">
      <div className="section-padding max-w-7xl mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-[#0a0f1a] font-extrabold text-sm">D&G</span>
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold text-white">CONSTRUCTORA D&G SPA</span>
              <span className="block text-xs text-gray-500">RUT 76.694.278-4 · Los Ángeles, Biobío</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a href="#inicio" className="hover:text-amber-400 transition-colors">Inicio</a>
            <a href="#servicios" className="hover:text-amber-400 transition-colors">Servicios</a>
            <a href="#proyectos" className="hover:text-amber-400 transition-colors">Proyectos</a>
            <a href="#nosotros" className="hover:text-amber-400 transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-amber-400 transition-colors">Contacto</a>
          </div>

          <div className="text-xs text-gray-600">
            © 2025 D&G Constructora SPA · Deck Comercial 2025
          </div>
        </div>
      </div>
    </footer>
  );
}
