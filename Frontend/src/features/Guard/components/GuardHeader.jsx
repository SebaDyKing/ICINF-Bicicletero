import { useState, useEffect, useRef } from "react";
import { User, LogOut, Bell, X, MapPin, Check, XCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../hooks/useSocket";

/**
 * @component GuardHeader
 * @brief Encabezado y centro de notificaciones en tiempo real para el panel de guardias.
 *
 * Este componente gestiona la identidad del usuario logueado y mantiene una conexión WebSocket
 * activa para recibir y gestionar solicitudes de asistencia de los dueños de bicicletas.
 * * Funcionalidades clave:
 * - **Recepción de Solicitudes:** Escucha el evento `nueva_solicitud_guardia` y alerta visualmente.
 * - **Sincronización entre Guardias:** Escucha `solicitud_tomada` para actualizar el estado de una
 * notificación si otro colega ya la atendió (mostrando "Atendida por [Nombre]"), evitando duplicidad de esfuerzos.
 * - **Gestión de Acciones:** Permite aceptar (emitiendo evento al socket) o rechazar (limpiando vista local) las tareas.
 * - **Navegación y Sesión:** Muestra información del guardia y gestiona el cierre de sesión.
 *
 * @returns {JSX.Element} Renderiza el header con logo, campana de notificaciones interactiva y controles de usuario.
 */
function GuardHeader() {
  // --- ESTADOS ---
  const [userName, setUserName] = useState("Guardia"); // Nombre a mostrar en el UI
  const [notifications, setNotifications] = useState([]); // Lista de notificaciones recibidas
  const [showNotifications, setShowNotifications] = useState(false); // Controla visibilidad del dropdown
  const [unreadCount, setUnreadCount] = useState(0); // Contador de alertas no leídas

  // --- HOOKS ---
  const navigate = useNavigate();
  const socket = useSocket(); // Hook personalizado para conexión Socket.io
  const notificationRef = useRef(null); // Referencia para detectar clics fuera del dropdown

  // --------------------------------------------------------------------------
  // EFECTO 1: RECUPERACIÓN DE DATOS DEL USUARIO
  // --------------------------------------------------------------------------
  // Intenta obtener el nombre del usuario desde localStorage.
  // Prioridad: 1. Objeto 'user' directo -> 2. Decodificación del Token JWT.
  useEffect(() => {
    const fetchUserData = () => {
      const userStr = localStorage.getItem("user");

      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);

          // --- LÓGICA DE NOMBRE DE USUARIO ---
          // Verifica si existe el nombre en el objeto plano almacenado.
          // Se concatena el apellido si está disponible para mostrar el nombre completo.
          if (userObj.nombre) {
            setUserName(`${userObj.nombre} ${userObj.apellido || ""}`);
          }
          // Si no hay nombre directo, intentamos decodificar el token JWT
          else if (userObj.token) {
            const decoded = jwtDecode(userObj.token);

            // Construimos el nombre completo desde el token
            // Fallback: Si no hay datos, muestra "Guardia (RUT)"
            const fullName =
              decoded.nombre && decoded.apellido
                ? `${decoded.nombre} ${decoded.apellido}`
                : decoded.nombre || decoded.name || `Guardia (${userObj.rut})`;

            setUserName(fullName);
          }
        } catch (error) {
          console.error("Error al procesar la identidad del usuario:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  // --------------------------------------------------------------------------
  // EFECTO 2: GESTIÓN DE SOCKETS (NOTIFICACIONES EN TIEMPO REAL)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleNuevaSolicitud = (data) => {
      const newNotification = {
        id: data.id || Date.now(),
        message: data.message,
        location: data.bicicletarioNombre || "Ubicación desconocida",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
        tomadaPor: null,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleSolicitudTomada = (data) => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => {
          // Buscamos la notificación por ID
          if (notif.id === data.id) {
            // Actualizamos el estado para que se renderice como "Atendida por..."
            return { ...notif, tomadaPor: data.tomadaPor };
          }
          return notif;
        })
      );
    };

    socket.on("nueva_solicitud_guardia", handleNuevaSolicitud);
    socket.on("solicitud_tomada", handleSolicitudTomada);

    return () => {
      socket.off("nueva_solicitud_guardia", handleNuevaSolicitud);
      socket.off("solicitud_tomada", handleSolicitudTomada);
    };
  }, [socket]);

  // --------------------------------------------------------------------------
  // EFECTO 3: CIERRE DE DROPDOWN AL HACER CLICK FUERA
  // --------------------------------------------------------------------------
  useEffect(() => {
    function handleClickOutside(event) {
      // Si el click fue fuera del contenedor de notificaciones, cierra el dropdown
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  /** Alterna la visibilidad del panel de notificaciones */
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleAccept = (notif, e) => {
    e.stopPropagation();

    if (socket) {
      // Enviamos al backend quién acepta y dónde
      socket.emit("guardia_responde_solicitud", {
        solicitudId: notif.id,
        accion: "aceptar",
        guardiaNombre: userName,
        bicicleteroNombre: notif.location,
      });
    }

    // Eliminar de MI lista inmediatamente (porque yo ya la estoy atendiendo)
    removeNotificationLocal(notif.id);
  };

  const handleReject = (id, e) => {
    e.stopPropagation();
    // Eliminar de la lista visualmente
    removeNotificationLocal(id);
  };

  const removeNotificationLocal = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  /** Limpia todas las notificaciones y resetea el contador */
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div>
      {showNotifications && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden animate-fade-in" />
      )}

      <header className="bg-[#003366] text-white shadow-md w-full transition-all sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src="/LogoUBB2.png"
              alt="Logo UBB"
              className="h-8 md:h-12 w-auto object-contain"
            />
            <div className="leading-tight border-l border-blue-500/30 pl-2 md:pl-4">
              <h1 className="text-sm md:text-xl font-bold leading-none tracking-wide">
                Panel Guardia
              </h1>
              <p className="hidden xs:block text-[10px] md:text-sm text-blue-200 font-light mt-0.5">
                Gestión
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {/* --- 1. BOTÓN DE CAMPANA (NOTIFICACIONES) --- */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-blue-800 transition-colors focus:outline-none"
                aria-label="Ver notificaciones"
              >
                <Bell size={22} className="text-blue-100 md:w-6 md:h-6" />

                {/* Badge de contador rojo */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] md:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* --- DROPDOWN --- */}
              {showNotifications && (
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 text-gray-800 fixed left-4 right-4 top-20 z-50 md:absolute md:fixed-none md:top-full md:right-0 md:left-auto md:w-96 md:mt-3">
                  {/* Header Dropdown */}
                  <div className="bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-sm text-gray-700">
                      Solicitudes
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-100"
                      >
                        Limpiar todo
                      </button>
                    )}
                  </div>

                  {/* Lista Notificaciones */}
                  <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        <Bell size={32} className="mx-auto mb-2 opacity-20" />
                        Sin solicitudes pendientes
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 border-b transition-colors flex flex-col gap-2 relative group animate-fade-in
                                ${
                                  notif.tomadaPor
                                    ? "bg-gray-50"
                                    : "hover:bg-blue-50"
                                }
                            `}
                        >
                          {/* === CASO 1: SOLICITUD YA TOMADA === */}
                          {notif.tomadaPor ? (
                            <div className="flex items-start gap-3 opacity-80">
                              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1 shrink-0">
                                <User size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-blue-800 leading-snug">
                                  Atendida por {notif.tomadaPor}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  📍 {notif.location} • {notif.time}
                                </p>
                                <p className="text-[10px] text-gray-400 italic mt-1 uppercase tracking-wider">
                                  Solicitud cerrada
                                </p>
                              </div>
                              {/* Botón para quitar de la lista */}
                              <button
                                onClick={(e) => handleReject(notif.id, e)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                title="Borrar notificación"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            /* === CASO 2: SOLICITUD PENDIENTE === */
                            <div>
                              <div className="flex items-start gap-3">
                                <div className="bg-red-100 p-2 rounded-full text-red-600 mt-1 shrink-0">
                                  <MapPin size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 leading-snug">
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    📍{" "}
                                    <span className="font-medium text-gray-700">
                                      {notif.location}
                                    </span>{" "}
                                    • {notif.time}
                                  </p>
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end mt-1 pl-11">
                                <button
                                  onClick={(e) => handleReject(notif.id, e)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                  <XCircle size={14} /> Rechazar
                                </button>
                                <button
                                  onClick={(e) => handleAccept(notif, e)}
                                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors shadow-sm"
                                >
                                  <Check size={14} /> Aceptar
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* --- USUARIO --- */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-blue-300 uppercase font-bold hidden md:block">
                  Conectado como:
                </span>
                <p className="text-sm font-bold truncate max-w-25">
                  {userName}
                </p>
              </div>
              <div className="bg-blue-800/50 p-2 rounded-full border border-blue-700">
                <User size={18} className="text-blue-100" />
              </div>
            </div>

            {/* Separador vertical */}
            <div className="h-6 w-px bg-blue-800/50 hidden sm:block"></div>

            {/* --- LOGOUT --- */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white p-2 md:px-3 md:py-2 rounded-lg transition-all shadow-sm active:scale-95"
            >
              <LogOut size={18} />
              <span className="hidden md:inline text-sm font-medium">
                Salir
              </span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default GuardHeader;
