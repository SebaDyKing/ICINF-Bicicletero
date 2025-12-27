import React, { useState, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { jwtDecode } from "jwt-decode"; 
import { useNavigate } from 'react-router-dom';

/**
 * Componente: GuardHeader
 * -----------------------
 * Barra de navegación superior (Header) específica para el rol de Guardia.
 * Se mantiene visible en la parte superior (Sticky) y gestiona la identidad del usuario.
 * * @returns {JSX.Element} Elemento de encabezado renderizado.
 */
function GuardHeader() {
  // --- MANEJO DE ESTADO ---
  // Estado para almacenar el nombre visual del usuario. Valor inicial genérico.
  const [userName, setUserName] = useState("Guardia"); 
  
  // Hook para redireccionamiento programático
  const navigate = useNavigate();

  /**
   * Efecto: Carga de Datos del Usuario
   * ----------------------------------
   * Se ejecuta una sola vez al montar el componente ([]).
   * Su objetivo es determinar qué nombre mostrar en la esquina superior derecha.
   */
  useEffect(() => {
    const fetchUserData = () => {
      // 1. Accedemos al almacenamiento local persistente
      const userStr = localStorage.getItem('user');
      
      if (userStr) {
        try {
          // Parseamos el string JSON a un objeto JavaScript utilizable
          const userObj = JSON.parse(userStr);

          // --- ESTRATEGIA DE RECUPERACIÓN DE NOMBRE ---
          
          // Prioridad 1: Nombre directo (Optimización)
          // Si el backend ya nos envió el nombre limpio en el login, lo usamos directo.
          if (userObj.nombre) {
            setUserName(userObj.nombre);
            return; // Interrumpimos la ejecución, ya tenemos lo que buscamos.
          }

          // Prioridad 2: Decodificación de Token (Respaldo/Legacy)
          // Si el nombre no está explícito, intentamos abrir el Token JWT.
          if (userObj.token) {
            const decoded = jwtDecode(userObj.token);
            
            // Buscamos propiedades estándar ('nombre' o 'name') dentro del payload del token
            const nombreEnToken = decoded.nombre || decoded.name;
            
            if (nombreEnToken) {
              setUserName(nombreEnToken);
            } 
            // Prioridad 3: Fallback al RUT (Último recurso)
            // Si todo falla, mostramos el RUT para que el usuario sepa qué cuenta es.
            else if (userObj.rut) {
              setUserName(`Guardia (${userObj.rut})`);
            }
          }

        } catch (error) {
          // Captura errores de parseo JSON o tokens corruptos para evitar pantalla blanca
          console.error("Error crítico cargando identidad del usuario:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  /**
   * Función: handleLogout
   * ---------------------
   * Cierra la sesión del usuario de manera segura.
   * 1. Elimina las credenciales del almacenamiento local.
   * 2. Redirige a la página pública (Landing Page).
   */
  const handleLogout = () => {
    localStorage.removeItem('user');  // Datos del usuario
    localStorage.removeItem('token'); // Token de sesión JWT
    
    // Redirección a la ruta raíz '/'
    navigate('/'); 
  };

  // --- RENDERIZADO (JSX) ---
  return (
    // Header Sticky: Se queda pegado arriba (top-0) al hacer scroll
    <header className="bg-[#003366] text-white shadow-md w-full transition-all sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
        
        {/* === SECCIÓN IZQUIERDA: Identidad Institucional === */}
        <div className="flex items-center gap-2 md:gap-4">
          <img 
            src="/LogoUBB2.png" 
            alt="Logo Institucional UBB" 
            className="h-10 md:h-16 w-auto object-contain" 
          />
          {/* Títulos del Sistema con borde separador */}
          <div className="leading-tight border-l border-blue-500/30 pl-2 md:pl-4">
            <h1 className="text-sm md:text-xl font-bold leading-none tracking-wide">Panel de Guardia</h1> 
            <p className="text-[10px] md:text-sm text-blue-200 font-light mt-0.5">Sistema de Gestión</p>
          </div>
        </div>

        {/* === SECCIÓN DERECHA: Información de Usuario y Controles === */}
        <div className="flex items-center gap-2 md:gap-6">
          
          {/* Bloque de Información del Usuario */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
                {/* Etiqueta visible solo en escritorio (md:block) */}
                <span className="text-[10px] text-blue-300 uppercase font-bold leading-none mb-1 hidden md:block">
                  Conectado como:
                </span>
                {/* Nombre del usuario con truncado automático si es muy largo */}
                <p className="text-xs md:text-base font-bold leading-none truncate max-w-37.5 md:max-w-37.5">
                  {userName}
                </p>
            </div>
            
            {/* Avatar visual (Círculo con icono) */}
            <div className="bg-blue-800/50 p-2 md:p-2.5 rounded-full hidden sm:flex items-center justify-center border border-blue-700"> 
                <User size={18} className="md:w-5 md:h-5 text-blue-100" />
            </div>
          </div>
          
          {/* Divisor vertical decorativo */}
          <div className="h-8 w-px bg-blue-800/50 mx-1 hidden md:block"></div>

          {/* Botón de Acción: Cerrar Sesión */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            title="Cerrar Sesión e ir al Inicio"
            aria-label="Cerrar sesión"
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