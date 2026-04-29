import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function HvacInverter() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      <section className="pt-28 pb-12 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="text-cyan-400">Blog / Tecnología HVAC</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />15 Abril 2025</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            HVAC Inverter vs. Convencional: <span className="gradient-gold-text">guía para empresas del sur de Chile</span>
          </h1>
          <p className="text-lg text-gray-400">
            Todo lo que necesita saber antes de invertir en un sistema de climatización para su industria. 
            Diferencias técnicas, costos y retorno de inversión.
          </p>
        </div>
      </section>

      <article className="pb-16 section-padding">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Comparison Table */}
          <div className="card-dg p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Comparativa técnica
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1f2937]">
                    <th className="text-left text-xs text-gray-500 uppercase py-3">Característica</th>
                    <th className="text-left text-xs text-gray-500 uppercase py-3">Convencional (On/Off)</th>
                    <th className="text-left text-xs text-gray-500 uppercase py-3">Inverter</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Consumo energético', '100% (baseline)', '50-70% del baseline'],
                    ['Arranque del compresor', 'Pico de 6x consumo nominal', 'Arranque suave gradual'],
                    ['Control de temperatura', '±2-3°C de variación', '±0.5°C de precisión'],
                    ['Vida útil del compresor', '5-7 años', '10-15 años'],
                    ['Nivel de ruido', '50-60 dB (arranque fuerte)', '30-40 dB (operación continua suave)'],
                    ['Costo de equipo', '30-40% más barato', 'Inversión inicial mayor'],
                    ['ROI vs. convencional', '—', '18-24 meses'],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[#1f2937]/50">
                      <td className="py-3 text-sm text-gray-400">{row[0]}</td>
                      <td className="py-3 text-sm text-red-400">{row[1]}</td>
                      <td className="py-3 text-sm text-green-400 font-medium">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">¿Cómo funciona la tecnología Inverter?</h2>
            <div className="space-y-4">
              <p className="text-gray-400 leading-relaxed">
                Un aire acondicionado convencional funciona como un interruptor: <strong className="text-white">encendido al 100% o apagado</strong>. 
                Cada vez que arranca, el compresor consume un pico de 6 veces su consumo nominal. 
                Eso genera picos de consumo eléctrico, desgaste mecánico y variaciones de temperatura incómodas.
              </p>
              <p className="text-gray-400 leading-relaxed">
                La tecnología <strong className="text-amber-400">Inverter</strong> usa un variador de frecuencia que modula la velocidad del compresor 
                según la demanda real del ambiente. En lugar de apagarse, el compresor reduce su velocidad al mínimo necesario 
                para mantener la temperatura estable. <strong className="text-white">No hay picos de arranque, no hay variaciones de temperatura, 
                y el consumo se reduce a la mitad</strong>.
              </p>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-dg p-6">
              <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Cuándo NO conviene Inverter
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>• Uso esporádico (menos de 4 horas/día)</li>
                <li>• Ambientes sin aislamiento térmico</li>
                <li>• Presupuesto muy limitado (aunque el ROI lo justifica)</li>
                <li>• Espacios menores a 15 m²</li>
              </ul>
            </div>
            <div className="card-dg p-6 border-green-500/20">
              <h3 className="font-bold text-green-400 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Cuándo SÍ conviene Inverter
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>• Uso diario continuo (más de 6 horas/día)</li>
                <li>• Industrias con equipos de calor interno</li>
                <li>• Centros de salud que requieren temperatura estable</li>
                <li>• Tarifas eléctricas altas (como en el Biobío)</li>
                <li>• Ambientes con ocupación variable durante el día</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center card-dg p-8">
            <h3 className="text-xl font-bold text-white mb-3">¿Necesita asesoría para elegir su sistema HVAC?</h3>
            <p className="text-gray-400 mb-6">Evaluamos su espacio, consumo y presupuesto sin costo.</p>
            <a href="/contacto" className="btn-gold inline-flex items-center gap-2">
              Solicitar asesoría técnica
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
