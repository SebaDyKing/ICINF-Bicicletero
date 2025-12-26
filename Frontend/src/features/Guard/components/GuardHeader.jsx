import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from 'react-router-dom';

function GuardHeader() {
  const [userName, setUserName] = useState("Guardia"); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.nombre) {
          setUserName(decoded.nombre);
        }
      } catch (error) {
        console.error("Error al leer el token", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login'); 
  };

  return (
    <header className="bg-[#003366] text-white shadow-md w-full transition-all">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        
        {/* Lado Izquierdo: LOGO e Información */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <img 
            src="/LogoUBB2.png" 
            alt="Logo UBB" 
            className="h-12 md:h-16 w-auto object-contain" 
          />

          <div className="leading-tight border-l border-blue-800 pl-2 md:pl-4 block">
            <h1 className="text-sm md:text-xl font-bold leading-none">Panel de Guardia</h1> 
            <p className="text-[10px] md:text-sm text-gray-300">Sistema de Gestión</p>
          </div>
        </div>

        {/* Lado Derecho: Usuario */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-800 p-2 md:p-3 rounded-full"> 
                <User size={18} className="md:w-5 md:h-5" />
            </div>
            
            <div className="block text-right">
                {/* AQUÍ ESTÁ EL CAMBIO: max-w-20 en lugar de max-w-[80px] */}
                <p className="text-xs md:text-base font-medium max-w-20 md:max-w-none truncate">{userName}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition shadow-sm"
          >
            <LogOut size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="hidden md:inline font-medium">Salir</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default GuardHeader;