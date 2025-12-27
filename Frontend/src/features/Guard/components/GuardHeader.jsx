import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from 'react-router-dom';

/**
 * Componente: GuardHeader
 * -----------------------
 * Barra de navegación superior (Header) específica para el rol de Guardia.
 * Se mantiene visible en la parte superior (Sticky) y gestiona la identidad del usuario.
 * @returns {JSX.Element} Elemento de encabezado renderizado.
 */
function GuardHeader() {
  // --- MANEJO DE ESTADO ---
  const [userName, setUserName] = useState("Guardia"); 
  
  const navigate = useNavigate();

  /**
   * Efecto: Carga de Datos del Usuario
   * ----------------------------------
   * Se ejecuta una sola vez al montar.
   * Modificado para concatenar Nombre + Apellido.
   */
  useEffect(() => {
    const fetchUserData = () => {
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);

          // --- ESTRATEGIA DE RECUPERACIÓN DE NOMBRE ---
          
          // Prioridad 1: Objeto directo (LocalStorage)
          // El backend ahora envía 'nombre' y 'apellido' por separado.
          if (userObj.nombre) {
            const nombreCompleto = userObj.apellido 
                ? `${userObj.nombre} ${userObj.apellido}` 
                : userObj.nombre;
            
            setUserName(nombreCompleto);
            return; // Ya tenemos el dato, no seguimos buscando.
          }

          // Prioridad 2: Decodificación de Token
          if (userObj.token) {
            const decoded = jwtDecode(userObj.token);
            
            // Buscamos propiedades en el payload del token (también actualizamos esto en el back)
            const nombreEnToken = decoded.nombre || decoded.name;
            const apellidoEnToken = decoded.apellido;
            
            if (nombreEnToken) {
              const nombreCompletoToken = apellidoEnToken 
                ? `${nombreEnToken} ${apellidoEnToken}` 
                : nombreEnToken;
              
              setUserName(nombreCompletoToken);
            } 
            // Prioridad 3: Fallback al RUT
            else if (userObj.rut) {
              setUserName(`Guardia (${userObj.rut})`);
            }
          }

        } catch (error) {
          console.error("Error crítico cargando identidad del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');  
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  // --- RENDERIZADO (JSX) ---
  return (
    <header className="bg-[#003366] text-white shadow-md w-full transition-all sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        
        {/* === SECCIÓN IZQUIERDA: Identidad Institucional === */}
        <div className="flex items-center gap-2 md:gap-4">
          <img 
            src="/LogoUBB2.png" 
            alt="Logo Institucional UBB" 
            className="h-10 md:h-16 w-auto object-contain" 
          />
          <div className="leading-tight border-l border-blue-500/30 pl-2 md:pl-4">
            <h1 className="text-sm md:text-xl font-bold leading-none tracking-wide">Panel de Guardia</h1> 
            <p className="text-[10px] md:text-sm text-blue-200 font-light mt-0.5">Sistema de Gestión</p>
          </div>
        </div>

        {/* === SECCIÓN DERECHA: Información de Usuario y Controles === */}
        <div className="flex items-center gap-2 md:gap-6">
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
                <span className="text-[10px] text-blue-300 uppercase font-bold leading-none mb-1 hidden md:block">
                  Conectado como:
                </span>
                {/* Aquí se mostrará "Nombre Apellido" */}
                <p className="text-xs md:text-base font-bold leading-none truncate max-w-37.5 md:max-w-37.5">
                  {userName}
                </p>
            </div>
            
            <div className="bg-blue-800/50 p-2 md:p-2.5 rounded-full hidden sm:flex items-center justify-center border border-blue-700"> 
                <User size={18} className="md:w-5 md:h-5 text-blue-100" />
            </div>
          </div>
          
          <div className="h-8 w-px bg-blue-800/50 mx-1 hidden md:block"></div>

          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            title="Cerrar Sesión e ir al Inicio"
          >
            <LogOut size={16} className="md:w-4.5 md:h-4.5" />
            <span className="hidden md:inline font-medium">Salir</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default GuardHeader;