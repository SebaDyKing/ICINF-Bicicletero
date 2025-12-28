import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, X, MapPin } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useSocket } from "../../../hooks/useSocket"; 

function GuardHeader() {
  const [userName, setUserName] = useState("Guardia");
  const [notifications, setNotifications] = useState([]); 
  const [showNotifications, setShowNotifications] = useState(false); 
  const [unreadCount, setUnreadCount] = useState(0); 
  
  const navigate = useNavigate();
  const socket = useSocket(); 
  const notificationRef = useRef(null); 

  // --- EFECTOS (Lógica de Usuario y Socket igual que antes) ---
  useEffect(() => {
    const fetchUserData = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          if (userObj.nombre) setUserName(userObj.nombre);
          else if (userObj.token) {
            const decoded = jwtDecode(userObj.token);
            setUserName(decoded.nombre || decoded.name || `Guardia (${userObj.rut})`);
          }
        } catch (error) {
          console.error("Error identity", error);
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("nueva_solicitud_guardia", (data) => {
      const newNotification = {
        id: Date.now(),
        message: data.message,
        location: data.bicicletarioNombre || "Ubicación desconocida",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => socket.off("nueva_solicitud_guardia");
  }, [socket]);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const removeNotification = (id, e) => {
    e.stopPropagation(); 
    setNotifications((prev) => prev.filter(n => n.id !== id));
    if(unreadCount > 0) setUnreadCount(prev => prev - 1);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <>
      {/* BACKDROP MÓVIL: 
         Fondo oscuro que aparece SOLO en celular cuando se abren las notificaciones 
      */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" />
      )}

      <header className="bg-[#003366] text-white shadow-md w-full transition-all sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          
          {/* === IZQUIERDA: Logo (Optimizado Móvil) === */}
          <div className="flex items-center gap-2 md:gap-4">
            <img src="/LogoUBB2.png" alt="Logo UBB" className="h-8 md:h-12 w-auto object-contain" />
            
            {/* El borde y textos se ajustan o se ocultan en pantallas muy pequeñas */}
            <div className="leading-tight border-l border-blue-500/30 pl-2 md:pl-4">
              <h1 className="text-sm md:text-xl font-bold leading-none tracking-wide">Panel Guardia</h1>
              {/* Ocultamos el subtítulo en móvil extremo para ahorrar espacio */}
              <p className="hidden xs:block text-[10px] md:text-sm text-blue-200 font-light mt-0.5">
                Gestión
              </p>
            </div>
          </div>

          {/* === DERECHA: Controles === */}
          <div className="flex items-center gap-3 md:gap-6">

            {/* --- CAMPANA --- */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-blue-800 transition-colors focus:outline-none"
              >
                <Bell size={22} className="text-blue-100 md:w-6 md:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] md:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* --- DROPDOWN RESPONSIVE --- */}
              {showNotifications && (
                <div className={`
                  bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 text-gray-800
                  
                  /* CLASES MÓVIL (Fixed y centrado) */
                  fixed left-4 right-4 top-20 z-50 
                  
                  /* CLASES DESKTOP (Absolute y alineado a la derecha) */
                  md:absolute md:fixed-none md:top-full md:right-0 md:left-auto md:w-96 md:mt-3
                `}>
                  {/* Cabecera Dropdown */}
                  <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-sm text-gray-700">Alertas</h3>
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} className="text-xs text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-100">
                        Borrar todas
                      </button>
                    )}
                  </div>

                  {/* Lista con Scroll */}
                  <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        Sin novedades
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="px-4 py-3 border-b active:bg-blue-50 hover:bg-blue-50 transition-colors flex items-start gap-3 relative group">
                          <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1 shrink-0">
                             <MapPin size={16} />
                          </div>
                          <div className="flex-1 min-w-0"> {/* min-w-0 evita desbordamiento de texto flex */}
                            <p className="text-sm font-semibold text-gray-800 wrap-break-words leading-snug">
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                               📍 <span className="truncate">{notif.location}</span> • {notif.time}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => removeNotification(notif.id, e)}
                            className="text-gray-400 hover:text-red-500 p-2 md:p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --- USUARIO (Oculto en pantallas muy pequeñas) --- */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-blue-300 uppercase font-bold hidden md:block">
                  Conectado como:
                </span>
                <p className="text-sm font-bold truncate max-w-[100px]">
                  {userName}
                </p>
              </div>
              <div className="bg-blue-800/50 p-2 rounded-full border border-blue-700">
                 <User size={18} className="text-blue-100" />
              </div>
            </div>
            
            <div className="h-6 w-px bg-blue-800/50 hidden sm:block"></div>

            {/* --- LOGOUT (Icono solo en móvil) --- */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white p-2 md:px-3 md:py-2 rounded-lg transition-all shadow-sm active:scale-95"
              aria-label="Cerrar sesión"
            >
              <LogOut size={18} />
              <span className="hidden md:inline text-sm font-medium">Salir</span>
            </button>

          </div>
        </div>
      </header>
    </>
  );
}

export default GuardHeader;