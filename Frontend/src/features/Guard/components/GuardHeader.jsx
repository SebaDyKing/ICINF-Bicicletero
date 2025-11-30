import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; // <--- 1. Importamos la librería
import { useNavigate } from 'react-router-dom'; // Para redirigir al salir

function GuardHeader() {
  const [userName, setUserName] = useState("Guardia"); // Nombre por defecto
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Leemos el token REAL del navegador
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        // 3. Decodificamos el token
        const decoded = jwtDecode(token);
        
        // 4. Si el token trae el nombre, lo guardamos en el estado
        if (decoded.nombre) {
          setUserName(decoded.nombre);
        }
      } catch (error) {
        console.error("Error al leer el token", error);
      }
    }
  }, []);

  // Función para Cerrar Sesión
  const handleLogout = () => {
    // Borramos el token y el usuario guardado
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirigimos al login o al home
    navigate('/login'); 
  };

  return (
    <header className="bg-[#003366] text-white shadow-md w-full">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Lado Izquierdo: Logo */}
        <div className="flex items-center gap-4">
          <div className="bg-white text-[#003366] font-bold p-1 rounded px-2 text-sm">
            UBB
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-bold">Panel de Guardia</h1>
            <p className="text-xs text-gray-300">Sistema de Gestión</p>
          </div>
        </div>

        {/* Lado Derecho: Usuario */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-800 p-2 rounded-full">
                <User size={18} />
            </div>
            <div className="hidden md:block text-right">
                {/* AQUI SE MUESTRA EL NOMBRE REAL */}
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-300">Guardia Turno</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout} // Conectamos la función de salir
            className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default GuardHeader;