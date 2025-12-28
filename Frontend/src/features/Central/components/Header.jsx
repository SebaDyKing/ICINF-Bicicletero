import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LogOut, 
  BarChart3, 
  Lock, 
  User 
} from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const linkBaseClasses = "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap";
  const activeClasses = "bg-blue-600 text-white shadow-lg shadow-blue-900/20 ring-1 ring-blue-500";
  const inactiveClasses = "text-slate-400 hover:text-white hover:bg-slate-800";

  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 text-white w-full font-sans sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* --- LOGO --- */}
            <div className="flex items-center gap-3 shrink-0 select-none">
              <img 
                src="/LogoUBB2.png" 
                alt="Escudo UBB" 
                className="h-10 md:h-12 w-auto drop-shadow-md" 
              />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base md:text-lg tracking-tight text-white">Bicicleteros UBB</span>
                <span className="text-[9px] md:text-[10px] text-blue-400 font-medium uppercase tracking-wider">Central de Seguridad</span>
              </div>
            </div>

            {/* --- NAVEGACIÓN DESKTOP --- */}
            <nav className="hidden md:flex items-center gap-2 ml-4">
              <Link 
                to="/central/home" 
                className={`${linkBaseClasses} ${location.pathname.includes('/central/home') ? activeClasses : inactiveClasses}`}
              >
                <BarChart3 size={18} /> Estadísticas
              </Link>
              <Link 
                to="/central/security" 
                className={`${linkBaseClasses} ${location.pathname.includes('/central/security') ? activeClasses : inactiveClasses}`}
              >
                <Lock size={18} /> Centro de Seguridad
              </Link>
            </nav>

            {/* --- DERECHA: PERFIL Y SALIR --- */}
            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden sm:flex items-center gap-3 pl-5 border-l border-slate-700 h-8">
                <div className="flex flex-col text-right justify-center">
                  <span className="text-xs md:text-sm font-medium text-white">Administrador</span>
                  <span className="text-[9px] md:text-[10px] text-slate-500">Central UBB</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/')} 
                className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 border border-red-500/20"
              >
                <LogOut size={16} />
                <span className="hidden xs:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- NAVEGACIÓN MÓVIL (Solo visible en celulares) --- */}
        <div className="md:hidden border-t border-slate-800 bg-slate-900/50 backdrop-blur-md px-4 py-2 overflow-x-auto">
          <nav className="flex items-center gap-2">
            <Link 
              to="/central/home" 
              className={`${linkBaseClasses} flex-1 justify-center ${location.pathname.includes('/central/home') ? activeClasses : inactiveClasses}`}
            >
              <BarChart3 size={16} /> <span className="text-xs">Estadísticas</span>
            </Link>
            <Link 
              to="/central/security" 
              className={`${linkBaseClasses} flex-1 justify-center ${location.pathname.includes('/central/security') ? activeClasses : inactiveClasses}`}
            >
              <Lock size={16} /> <span className="text-xs">Seguridad</span>
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
};