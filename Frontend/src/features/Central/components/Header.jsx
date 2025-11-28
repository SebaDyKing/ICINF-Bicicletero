import React from 'react';

export const Header = () => {

  const linkBaseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer";
  
  
  const inactiveClasses = "text-gray-300 hover:bg-white/10 hover:text-white";

  const activeClasses = "bg-blue-600 text-white shadow-sm";

  return (
    <header className="bg-slate-900 text-white shadow-md w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">


          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <span className="bg-white text-slate-900 font-bold px-3 py-1 rounded text-lg">
                UBB
              </span>
            </div>

            <nav className="hidden md:flex space-x-2">
              
     
              <a className={`${linkBaseClasses} ${inactiveClasses}`}>
                Bicicleteros
              </a>

         
              <a className={`${linkBaseClasses} ${inactiveClasses}`}>
                Reportes de Robo
              </a>

              <a className={`${linkBaseClasses} ${activeClasses}`}>
                Estadísticas
              </a>
              
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
              <span>👤</span>
              <span>Perfil</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm cursor-pointer">
              <span>⏏</span>
              <span>Cerrar Sesión</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};