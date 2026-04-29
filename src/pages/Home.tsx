import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/sections/Hero";
import VentajaCompetitiva from "@/sections/VentajaCompetitiva";
import Servicios from "@/sections/Servicios";
import Autoridad from "@/sections/Autoridad";
import DashboardTeaser from "@/sections/DashboardTeaser";
import DeckDownload from "@/sections/DeckDownload";
import Proyectos from "@/sections/Proyectos";
import Contacto from "@/sections/Contacto";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      <Navbar />
      <Hero />
      <VentajaCompetitiva />
      <Servicios />
      <Autoridad />
      <DashboardTeaser />
      <DeckDownload />
      <Proyectos />
      <Contacto />
      <Footer />
    </div>
  );
}
