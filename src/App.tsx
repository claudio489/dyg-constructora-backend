import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";

const Home = lazy(() => import("@/pages/Home"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Login = lazy(() => import("@/pages/Login"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Admin = lazy(() => import("@/pages/Admin"));

// SEO Service Pages
const Construccion = lazy(() => import("@/pages/servicios/Construccion"));
const Climatizacion = lazy(() => import("@/pages/servicios/Climatizacion"));
const Montaje = lazy(() => import("@/pages/servicios/Montaje"));

// Blog Pages
const BlogEficiencia = lazy(() => import("@/pages/blog/EficienciaEnergetica"));
const BlogHvacInverter = lazy(() => import("@/pages/blog/HvacInverter"));
const BlogNormativa = lazy(() => import("@/pages/blog/NormativaSalud"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
      <div className="text-amber-400 animate-pulse text-sm">Cargando...</div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/api/oauth/callback" element={<Login />} />
        <Route path="/licitaciones" element={<Dashboard />} />

        {/* SEO Service Pages */}
        <Route path="/servicios/construccion" element={<Construccion />} />
        <Route path="/servicios/climatizacion" element={<Climatizacion />} />
        <Route path="/servicios/montaje" element={<Montaje />} />

        {/* Blog Pages */}
        <Route path="/blog/eficiencia-energetica" element={<BlogEficiencia />} />
        <Route path="/blog/hvac-inverter-vs-convencional" element={<BlogHvacInverter />} />
        <Route path="/blog/normativa-climatizacion-salud" element={<BlogNormativa />} />
        <Route path="/admin" element={<Admin />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Suspense>
  );
}
