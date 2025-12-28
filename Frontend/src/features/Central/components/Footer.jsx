import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Lado Izquierdo: Branding sutil */}
          <div className="flex items-center gap-3">
            <img 
              src="/LogoUBB2.png" 
              alt="UBB" 
              className="h-8 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm">Central de Seguridad</span>
              <p className="text-[10px] uppercase tracking-widest">Universidad del Bío-Bío</p>
            </div>
          </div>

          {/* Lado Derecho: Copyright */}
          <div className="text-center md:text-right">
            <p className="text-[10px] md:text-xs">
              &copy; {currentYear} Sistema de Bicicleteros. 
              <span className="hidden sm:inline"> Todos los derechos reservados.</span>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};