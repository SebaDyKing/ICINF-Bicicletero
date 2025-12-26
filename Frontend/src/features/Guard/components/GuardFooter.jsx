import React from 'react';

const GuardFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002D56] text-white py-8 mt-auto shadow-inner w-full border-t border-blue-900">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Lado Izquierdo: Logo + Información */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          
          {/* Logo UBB (Ajustado para footer) */}
          <img 
            src="/LogoUBB2.png" 
            alt="Logo UBB" 
            className="h-12 w-auto object-contain brightness-90" // Un poco menos brillante para que se vea elegante
          />

          {/* Divisor vertical (solo visible en escritorio) */}
          <div className="hidden md:block h-8 w-[1px] bg-blue-700/50"></div>

          {/* Textos */}
          <div>
            <p className="font-medium text-base">Universidad del Bío-Bío</p>
            <p className="text-sm text-gray-400 mt-0.5">
              © {currentYear} Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Lado Derecho: Nombre del sistema */}
        <div className="text-sm text-gray-300 opacity-80">
          Sistema de Gestión de Bicicletas
        </div>

      </div>
    </footer>
  );
};

export default GuardFooter;