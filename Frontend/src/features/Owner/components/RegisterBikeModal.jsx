import { useState } from "react";
import {
  X,
  Save,
  Bike,
  ChevronDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createBicycleService } from "../services/bicycle.service";

/**
 * @brief Componente Modal para el registro de una nueva bicicleta.
 *
 * Este componente gestiona el formulario de ingreso de datos para una bicicleta.
 * Implementa validaciones locales (campos vacíos), maneja la interacción con el
 * servicio de backend y gestiona estados de UI complejos como menús desplegables
 * personalizados con filtro de búsqueda y notificaciones integradas.
 *
 * @param {boolean} isOpen - Controla si el modal está visible o no en el DOM.
 * @param {function} onClose - Función para cerrar el modal y limpiar estados si es necesario.
 * @param {function} onSuccess - Callback que se ejecuta tras un registro exitoso (ideal para recargar listas).
 * @param {string} userRut - RUT del usuario actual, necesario para asociar la bicicleta.
 */
const RegisterBikeModal = ({ isOpen, onClose, onSuccess, userRut }) => {
  // --- GESTIÓN DE ESTADO DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    alias: "",
    marca: "",
    modelo: "",
    color: "",
    tipo: "",
  });

  // --- ESTADOS DE INTERFAZ DE USUARIO (UI) ---
  const [loading, setLoading] = useState(false); // Bloquea el botón durante el envío
  const [notification, setNotification] = useState({ type: "", message: "" }); // Mensajes de éxito/error
  const [activeDropdown, setActiveDropdown] = useState(null); // Controla qué menú custom está abierto ("color", "tipo" o null)

  // Listas estáticas para las opciones de los selectores
  const opcionesColores = [
    "Amarillo", "Azul", "Blanco", "Celeste", "Gris", "Marrón", "Morado",
    "Negro", "Naranjo", "Rojo", "Verde", "Rosa", "Cromado",
  ];

  const opcionesTipos = [
    "Montaña (MTB)", "Ruta", "Urbana", "Plegable", "Eléctrica", "BMX", "Otro",
  ];

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  /**
   * Maneja los cambios en inputs de texto estándar.
   * También limpia los errores visuales apenas el usuario empieza a escribir.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Elimina automaticamente las alertas cada vez que se escribe
    if (notification.type === "error")
      setNotification({ type: "", message: "" });
  };

  /**
   * Maneja la selección de un ítem en los menús desplegables personalizados.
   * Actualiza el form y cierra el menú inmediatamente.
   */
  const handleSelectOption = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActiveDropdown(null);
  };

  /**
   * Lógica principal de envío del formulario.
   * 1. Valida campos.
   * 2. Llama al servicio.
   * 3. Maneja la respuesta y feedback visual.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validación Local: Campos obligatorios
    if (
      !formData.alias ||
      !formData.marca ||
      !formData.tipo ||
      !formData.color
    ) {
      setNotification({
        type: "error",
        message: "Por favor completa alias, marca, tipo y color.",
      });
      return;
    }

    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const data = {
        ...formData,
        rut_duenio: userRut,
      };

      // 2. Llamada al Servicio (Backend)
      const newBike = await createBicycleService(data);

      // 3. Éxito: Mostrar feedback positivo
      setNotification({
        type: "success",
        message: `¡Registrada correctamente! Código: ${newBike.alias || "OK"}`,
      });

      // Retrasar el cierre para que el usuario lea el mensaje de éxito
      setTimeout(() => {
        setFormData({ alias: "", marca: "", modelo: "", color: "", tipo: "" });
        setNotification({ type: "", message: "" });
        setActiveDropdown(null);
        if (onSuccess) onSuccess(newBike); // Notificar al padre
        onClose();
      }, 2000);

    } catch (error) {
      console.error(error);
      // Manejo de Errores: Mostrar mensaje del backend o genérico
      setNotification({
        type: "error",
        message: error.message || "No se pudo registrar la bicicleta",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      alias: "",
      marca: "",
      modelo: "",
      color: "",
      tipo: "",
    });
    setNotification({ type: "", message: "" });
    setActiveDropdown(null);
    onClose();
  };

  return (
    // Overlay oscuro con blur
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      
      {/* Contenedor principal del Modal */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bike size={20} className="text-blue-700" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Registrar Bicicleta
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo */}
        <div
          className="overflow-y-auto p-6"
          onClick={() => setActiveDropdown(null)}
        >
          {/* Componente de Notificación */}
          {notification.message && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${
                notification.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-green-50 text-green-700 border border-green-100"
              }`}
            >
              {notification.type === "error" ? (
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
              ) : (
                <CheckCircle size={16} className="mt-0.5 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            // Evita que el click dentro del form cierre los dropdowns inmediatamente
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Input Alias */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Alias <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                // Al enfocar un input normal, cerramos los dropdowns custom
                onFocus={() => setActiveDropdown(null)}
                placeholder="Ej: Bicicleta 1, Rutera..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input Marca */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Marca <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  onFocus={() => setActiveDropdown(null)}
                  placeholder="Ej: Trek"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              {/* Input Modelo */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  onFocus={() => setActiveDropdown(null)}
                  placeholder="Ej: Marlin 5"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* SELECTOR CUSTOM: COLOR (Despliegue hacia abajo)
                Combina un input de texto para filtrar y una lista ul absoluta
            */}
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  onClick={() => setActiveDropdown("color")}
                  placeholder="Selecciona o escribe..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-10"
                  autoComplete="off" // Le dice al navegador que no muestre su propio historial de autocompletado
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer p-1"
                  onClick={() =>
                    setActiveDropdown(
                      activeDropdown === "color" ? null : "color"
                    )
                  }
                >
                  <ChevronDown size={16} />
                </div>
              </div>

              {/* Lista desplegable filtrada */}
              {activeDropdown === "color" && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                  {opcionesColores
                    .filter((c) =>
                      c.toLowerCase().includes(formData.color.toLowerCase())
                    )
                    .map((color) => (
                      <li
                        key={color}
                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                        onClick={() => handleSelectOption("color", color)}
                      >
                        {color}
                      </li>
                    ))}
                  {/* Mensaje si no hay resultados en el filtro */}
                  {opcionesColores.filter((c) =>
                    c.toLowerCase().includes(formData.color.toLowerCase())
                  ).length === 0 && (
                    <li className="px-3 py-2 text-sm text-slate-400 italic">
                      Sin sugerencias
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* SELECTOR CUSTOM: TIPO (Despliegue hacia ARRIBA) 
                Se usa 'bottom-full' para evitar que el menú quede oculto por el borde inferior del modal
            */}
            <div className="space-y-1 relative">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Tipo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  onClick={() => setActiveDropdown("tipo")}
                  placeholder="Selecciona o escribe..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all pr-10"
                  autoComplete="off"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer p-1"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === "tipo" ? null : "tipo")
                  }
                >
                  <ChevronDown size={16} />
                </div>
              </div>

              {activeDropdown === "tipo" && (
                <ul className="absolute z-10 w-full bottom-full mb-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 origin-bottom">
                  {opcionesTipos
                    .filter((t) =>
                      t.toLowerCase().includes(formData.tipo.toLowerCase())
                    )
                    .map((tipo) => (
                      <li
                        key={tipo}
                        className="px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm text-slate-700"
                        onClick={() => handleSelectOption("tipo", tipo)}
                      >
                        {tipo}
                      </li>
                    ))}
                  {opcionesTipos.filter((t) =>
                    t.toLowerCase().includes(formData.tipo.toLowerCase())
                  ).length === 0 && (
                    <li className="px-3 py-2 text-sm text-slate-400 italic">
                      Sin sugerencias
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Botones de Acción (Cancelar / Registrar) */}
            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <Save size={16} /> Registrar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterBikeModal;