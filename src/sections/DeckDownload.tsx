import { FileDown, FileText, ArrowDown, Presentation } from 'lucide-react';
import { useState } from 'react';

export default function DeckDownload() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = '/deck/deck-comercial-dyg-2025.pdf';
    link.download = 'Deck-Comercial-DYG-Constructora-2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <section id="deck" className="section-padding py-20 bg-[#070b14]">
      <div className="max-w-5xl mx-auto">
        <div className="card-dg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - Content */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="badge-gold inline-flex items-center gap-2 mb-4 self-start">
                <Presentation className="w-4 h-4" />
                Carta de Presentación
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                Deck Comercial <span className="gradient-gold-text">2025</span>
              </h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Descarga nuestra carta de presentación ejecutiva con el portafolio completo de proyectos, 
                indicadores de desempeño, equipo ejecutivo y modelo multiservicio B2B. 
                Documento optimizado para compartir con mandantes y evaluadores de licitaciones.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { icon: FileText, text: 'Portafolio completo: 21 proyectos ejecutados' },
                  { icon: FileText, text: 'Indicadores: 60.000+ m², 3.105 días sin accidentes' },
                  { icon: FileText, text: 'Modelo multiservicio B2B' },
                  { icon: FileText, text: 'Equipo ejecutivo y certificaciones' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-400">
                    <item.icon className="w-4 h-4 text-amber-400 shrink-0" />
                    {item.text}
                  </div>
                ))}
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn-gold inline-flex items-center justify-center gap-2 self-start px-6 py-3 rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#0a0f1a] border-t-transparent rounded-full animate-spin" />
                    Descargando...
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4" />
                    Descargar Deck (PDF)
                  </>
                )}
              </button>
            </div>

            {/* Right - Preview */}
            <div className="relative bg-gradient-to-br from-[#111827] to-[#0a0f1a] p-8 md:p-10 flex items-center justify-center border-l border-[#1f2937]">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(245,158,11,0.03) 35px, rgba(245,158,11,0.03) 70px)`
                }} />
              </div>

              <div className="relative text-center">
                {/* Document preview mockup */}
                <div className="w-48 h-64 bg-[#0a0f1a] rounded-lg border-2 border-amber-500/30 shadow-2xl shadow-amber-500/10 mx-auto mb-6 overflow-hidden relative">
                  {/* Header bar */}
                  <div className="h-12 bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
                    <span className="text-[#0a0f1a] font-black text-xs tracking-wider">D&G CONSTRUCTORA</span>
                  </div>
                  {/* Content lines */}
                  <div className="p-4 space-y-2">
                    <div className="h-2 bg-amber-500/20 rounded w-3/4" />
                    <div className="h-2 bg-gray-700 rounded w-full" />
                    <div className="h-2 bg-gray-700 rounded w-5/6" />
                    <div className="h-2 bg-gray-700 rounded w-full" />
                    <div className="mt-4 h-16 bg-amber-500/10 rounded border border-amber-500/20" />
                    <div className="mt-2 h-2 bg-gray-700 rounded w-4/5" />
                    <div className="h-2 bg-gray-700 rounded w-full" />
                    <div className="h-2 bg-gray-700 rounded w-3/4" />
                  </div>
                  {/* Download overlay */}
                  <div className="absolute inset-0 bg-[#0a0f1a]/80 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                      <ArrowDown className="w-7 h-7 text-amber-400 animate-bounce" />
                    </div>
                    <span className="text-amber-400 text-xs font-bold">PDF</span>
                  </div>
                </div>

                <p className="text-gray-500 text-xs">
                  Deck Comercial 2025<br />
                  Formato PDF · 8 páginas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
