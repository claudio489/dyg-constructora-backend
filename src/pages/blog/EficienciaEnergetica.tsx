import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Zap, Calendar, ArrowRight, TrendingDown } from 'lucide-react';

export default function EficienciaEnergetica() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />

      {/* Article Header */}
      <section className="pt-28 pb-12 section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
            <span className="text-cyan-400">Blog / Eficiencia Energética</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />29 Abril 2025</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            Cómo reducir un <span className="gradient-gold-text">40% el gasto energético</span> en industrias del Biobío
          </h1>
          <p className="text-lg text-gray-400">
            Guía práctica para empresas de la Región del Biobío que enfrentan los altos costos 
            de la electricidad. Tecnología Inverter, mantenimiento preventivo y dimensionamiento correcto.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="pb-16 section-padding">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Intro */}
          <div className="card-dg p-8 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-bold text-white">El problema: energía cara en el sur</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              La Región del Biobío tiene una de las tarifas eléctricas más altas de Chile. 
              Una industria promedio de 1.000 m² gasta entre <strong className="text-white">$8 y $15 millones mensuales</strong> solo en climatización 
              y calefacción. Con los aumentos recientes, muchas empresas están viendo sus gastos operativos 
              subir un 20-30% sin haber aumentado su producción.
            </p>
          </div>

          {/* 5 Tips */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">5 estrategias que aplicamos en D&G</h2>
            <div className="space-y-6">
              {[
                { 
                  num: '01', 
                  title: 'Tecnología Inverter: el corazón del ahorro',
                  desc: 'Los sistemas Inverter ajustan automáticamente la velocidad del compresor según la demanda real, en lugar de encender/apagar cíclicamente. Esto reduce el consumo entre un 30% y 50% comparado con sistemas on/off tradicionales. En D&G instalamos exclusivamente equipos Inverter para proyectos industriales.'
                },
                { 
                  num: '02', 
                  title: 'Dimensionamiento a la medida',
                  desc: 'Un equipo sobredimensionado consume más energía y se desgasta más rápido. Un equipo subdimensionado nunca alcanza la temperatura deseada. En D&G hacemos cálculos térmicos precisos considerando: m², altura de techos, aislamiento, ocupación, equipos internos de calor y exposición solar.'
                },
                { 
                  num: '03', 
                  title: 'Mantenimiento preventivo trimestral',
                  desc: 'Un filtro sucio aumenta el consumo un 15%. Un serpentín con pollo aumenta un 20%. Nuestro plan de mantenimiento preventivo incluye: limpieza de filtros, revisión de refrigerante, lubricación de motores, calibración de termostatos e inspección de ductería. Costo del mantenimiento vs. ahorro: ROI positivo en el primer mes.'
                },
                { 
                  num: '04', 
                  title: 'Aislamiento térmico de envolvente',
                  desc: 'El 40% del calor entra/sale por muros, techos y ventanas mal aislados. Antes de dimensionar el HVAC, evaluamos la envolvente del edificio. Muchas veces, invertir $2-3 millones en aislamiento de cubierta reduce en un 25% la capacidad necesaria del equipo HVAC.'
                },
                { 
                  num: '05', 
                  title: 'Zonificación inteligente',
                  desc: 'No todas las áreas de una industria necesitan la misma temperatura. Oficinas: 22°C. Bodegas: 18°C. Plantas de producción: según proceso. Con sistemas Multi Split o VRF, climatizamos cada zona según su necesidad real, sin gastar energía en enfriar espacios que no lo requieren.'
                },
              ].map((tip, i) => (
                <div key={i} className="card-dg p-6 flex items-start gap-4">
                  <span className="text-3xl font-black gradient-gold-text flex-shrink-0">{tip.num}</span>
                  <div>
                    <h3 className="font-bold text-white mb-2">{tip.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Case Study */}
          <div className="card-dg p-8 border-amber-500/20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Caso real: Industria del Biobío
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-red-400 font-semibold mb-2">Antes (sistema antiguo)</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Consumo mensual: $12.400.000</li>
                  <li>• Sistema: Split on/off de 10 años</li>
                  <li>• Temperatura inestable: ±4°C</li>
                  <li>• Reparaciones frecuentes: $800.000/mes</li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-400 font-semibold mb-2">Después (D&G HVAC Inverter)</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>• Consumo mensual: $7.200.000</li>
                  <li>• Sistema: Multi Split Inverter nuevo</li>
                  <li>• Temperatura estable: ±0.5°C</li>
                  <li>• Mantenimiento preventivo: $150.000/mes</li>
                  <li className="text-green-400 font-bold pt-2">Ahorro: $5.850.000/mes (47%)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center card-dg p-8">
            <h3 className="text-xl font-bold text-white mb-3">¿Quiere saber cuánto podría ahorrar su industria?</h3>
            <p className="text-gray-400 mb-6">
              Evaluación técnica gratuita. Analizamos su consumo actual y proponemos la solución óptima.
            </p>
            <a href="/contacto" className="btn-gold inline-flex items-center gap-2">
              Solicitar evaluación energética
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
