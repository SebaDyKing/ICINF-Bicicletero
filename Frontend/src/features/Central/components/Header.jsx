import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {

  const linkBaseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer";
  
  
  const inactiveClasses = "text-gray-300 hover:bg-white/10 hover:text-white";

  const activeClasses = "bg-blue-600 text-white shadow-sm";

  const navigate = useNavigate()


  return (
    <header className="bg-slate-900 text-white shadow-md w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">


          <div className="flex items-center gap-8">
            <div className="shrink-0">
              <span className="bg-white text-slate-900 font-bold px-3 py-1 rounded text-lg">
                UBB
              </span>
            </div>

            <nav className="hidden md:flex space-x-2">

              <Link to="/central/home" className={`${linkBaseClasses} ${activeClasses}`}>
                Estadísticas
              </Link>

              <Link to="/central/security" className={`${linkBaseClasses} ${inactiveClasses}`}>
                Centro de seguridad
              </Link>

              
              
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
              <span>👤</span>
              <span>Central</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
              
              <button onClick={() => navigate('/login')} // Conectamos la función de salir
              className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};