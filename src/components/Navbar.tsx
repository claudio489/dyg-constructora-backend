import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setOpen(false);
    }
  };

  const NavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => {
    if (isHome && to.startsWith('#')) {
      return (
        <button
          onClick={() => { scrollTo(to.slice(1)); onClick?.(); }}
          className="text-sm text-gray-400 hover:text-amber-400 transition-colors font-medium"
        >
          {children}
        </button>
      );
    }
    return (
      <Link
        to={to}
        onClick={onClick}
        className="text-sm text-gray-400 hover:text-amber-400 transition-colors font-medium"
      >
        {children}
      </Link>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/90 backdrop-blur-md border-b border-[#1f2937]">
      <div className="section-padding max-w-7xl mx-auto flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="/logo-dyg.png" 
            alt="D&G Constructora SPA" 
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="leading-tight">
            <span className="block text-sm font-extrabold tracking-wider text-white">CONSTRUCTORA</span>
            <span className="block text-xs font-bold tracking-widest text-amber-500">D&G SPA</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/#servicios">Servicios</NavLink>
          <NavLink to="/#proyectos">Proyectos</NavLink>
          <NavLink to="/#deck">Deck</NavLink>
          <NavLink to="/#contacto">Contacto</NavLink>
          <Link to="/licitaciones" className="btn-gold text-sm py-2.5 px-6">
            Cotizar proyecto
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#111827] border-t border-[#1f2937] p-4 space-y-3">
          <NavLink to="/" onClick={() => setOpen(false)}>Inicio</NavLink>
          <NavLink to="/#servicios" onClick={() => setOpen(false)}>Servicios</NavLink>
          <NavLink to="/#proyectos" onClick={() => setOpen(false)}>Proyectos</NavLink>
          <NavLink to="/#deck" onClick={() => setOpen(false)}>Deck</NavLink>
          <NavLink to="/#contacto" onClick={() => setOpen(false)}>Contacto</NavLink>
          <Link to="/licitaciones" onClick={() => setOpen(false)} className="btn-gold text-sm py-2.5 px-6 block text-center mt-2">
            Cotizar proyecto
          </Link>
        </div>
      )}
    </nav>
  );
}
