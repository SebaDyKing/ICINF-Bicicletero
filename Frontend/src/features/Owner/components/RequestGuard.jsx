import { useState } from "react";
import {
  Shield,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { solicitarGuardService } from "../services/owner.service";
import HeaderOwner from "./HeaderOwner";

/**
 * @component RequestGuard
 * @brief Vista de interacción para solicitar asistencia presencial de un guardia.
 *
 * Este componente permite al dueño de una bicicleta generar una alerta cuando
 * no encuentra personal en el bicicletero.
 *
 * Funcionalidades principales:
 * - **Geolocalización:** Obtiene las coordenadas precisas del usuario mediante la API del navegador.
 * - **Validación y Servicio:** Consume `solicitarGuardService` para verificar la ubicación (radio de 20m)
 * y notificar a los guardias conectados vía WebSockets (gestionado en el backend).
 * - **Feedback Visual:** Gestiona estados de interfaz (idle, loading, success, error) para mostrar
 * mensajes claros, spinners de carga y confirmaciones visuales de éxito o fallo.
 *
 * @param {Object} props Props del componente.
 * @param {Object} props.user Objeto con la información del usuario autenticado (pasado al Header).
 * @returns {JSX.Element} Renderiza la página completa con instrucciones y el panel de acción.
 */
export const RequestGuard = ({ user }) => {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  /**
   * @brief Manejador principal de la solicitud.
   * Orquesta la obtención del GPS y la llamada al servicio del backend.
   */
  const handleRequestGuard = () => {
    // Si ya fue exitoso, no permitir más clics
    if (status === "success") return;

    setStatus("loading");
    setMessage("Obteniendo tu ubicación exacta...");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    // Configuración GPS: Alta precisión requerida para validar el radio de 20m.
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    // Ejecución de la geolocalización
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setMessage("Verificando cercanía al bicicletero...");
          const data = await solicitarGuardService(latitude, longitude);
          
          setStatus("success");
          setMessage(data.message || "Solicitud enviada exitosamente. Un guardia ha sido notificado.");

        } catch (error) {
          setStatus("error");
          setMessage(error.message || "No se pudo procesar la solicitud.");
        }
      },
      (error) => {
        console.error("Error GPS:", error);
        setStatus("error");
        // Mapeo de errores nativos a mensajes amigables
        let gpsMsg = "No se pudo obtener la ubicación.";
        if (error.code === 1) gpsMsg = "Debes permitir el acceso a la ubicación.";
        if (error.code === 2) gpsMsg = "Enciende tu GPS para continuar.";
        if (error.code === 3) gpsMsg = "Tiempo de espera agotado.";
        setMessage(gpsMsg);
      },
      options
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <HeaderOwner user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 mb-10">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Solicitud de Guardia</h1>
          <p className="text-gray-500 mt-1">
            Utiliza esta herramienta si necesitas asistencia presencial en el bicicletero.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Información */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                ¿Cuándo usar este botón?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Esta función está diseñada para alertar al personal de seguridad cuando 
                <strong> no se encuentra un guardia presente</strong> en el módulo del bicicletero 
                al momento de retirar o dejar tu bicicleta.
              </p>
              <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                <strong>Nota:</strong> Al presionar el botón, se enviará una alerta prioritaria 
                a los guardias.
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                Requisitos de Ubicación
              </h3>
              <p className="text-sm text-gray-600">
                Por seguridad, el sistema validará tu ubicación GPS. Debes estar en un radio de:
              </p>
              <div className="mt-3 text-center py-2 bg-gray-100 rounded-lg font-bold text-gray-800">
                20 Metros
              </div>
              <p className="text-sm text-center text-gray-800 mt-2">De un bicicletero</p>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Acción */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col">
              
              {/* Header de la tarjeta */}
              <div className={`p-6 text-white text-center sm:text-left sm:flex sm:items-center sm:justify-between transition-colors duration-500
                ${status === 'success' ? 'bg-green-700' : 'bg-blue-900'}
              `}>
                <div>
                  <h2 className="text-xl font-bold">
                    {status === 'success' ? 'Solicitud Completada' : 'Solicitar Asistencia'}
                  </h2>
                  <p className={`text-sm mt-1 ${status === 'success' ? 'text-green-100' : 'text-blue-200'}`}>
                    {status === 'success' ? 'El personal ha sido avisado' : 'Sistema de respuesta inmediata UBB'}
                  </p>
                </div>
                <div className={`mt-4 sm:mt-0 p-3 rounded-full hidden sm:block ${status === 'success' ? 'bg-green-600' : 'bg-blue-800'}`}>
                  {status === 'success' ? <CheckCircle2 className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
                </div>
              </div>

              {/* Cuerpo de la tarjeta */}
              <div className="p-8 flex-1 flex flex-col justify-center items-center">
                
                <div className="w-full max-w-md mx-auto text-center mb-8">
                    {status === 'success' ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                           <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                           <p className="text-gray-800 font-medium">
                             Tu solicitud fue recibida correctamente.
                           </p>
                           <p className="text-gray-500 text-sm mt-1">
                             Por favor espera en el lugar.
                           </p>
                        </div>
                    ) : (
                        <>
                           <Shield className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${status === 'error' ? 'text-red-500' : 'text-blue-900'}`} />
                           <p className="text-gray-600">
                             Presiona el botón a continuación solo si te encuentras en el bicicletero y requieres validación de un guardia.
                           </p>
                        </>
                    )}
                </div>

                <button
                  onClick={handleRequestGuard}
                  disabled={status === "loading" || status === "success"}
                  className={`
                    relative w-full max-w-md py-4 px-6 rounded-lg font-bold text-lg shadow-md transition-all duration-300 flex items-center justify-center gap-3
                    ${
                      status === "success"
                        ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed shadow-none" // Estilo Deshabilitado Final
                        : status === "loading"
                        ? "bg-blue-800 text-white opacity-80 cursor-wait"
                        : status === "error"
                        ? "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50"
                        : "bg-blue-700 text-white hover:bg-blue-800 hover:shadow-lg active:scale-[0.99]"
                    }
                  `}
                >
                  {status === "loading" && <Loader2 className="animate-spin h-5 w-5" />}
                  
                  {status === "success" ? (
                    <span className="flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5" />
                       Solicitud Enviada
                    </span>
                  ) : status === "loading" ? (
                    "Procesando..."
                  ) : status === "error" ? (
                    "Reintentar Solicitud"
                  ) : (
                    "SOLICITAR GUARDIA"
                  )}
                </button>

                {/* Mensajes de Error/Info adicional */}
                {message && status !== 'success' && (
                  <div className={`mt-6 w-full max-w-md p-4 rounded-lg flex items-start gap-3 text-sm animate-fade-in
                    ${status === "error" ? "bg-red-50 text-red-700 border border-red-100" : 
                      status === "loading" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                      "bg-gray-50 text-gray-600"}
                  `}>
                    <div className="shrink-0 mt-0.5">
                      {status === "error" && <AlertCircle className="w-5 h-5" />}
                      {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
                    </div>
                    <span>{message}</span>
                  </div>
                )}

              </div>
              
              {/* Footer de la tarjeta */}
              <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                 <p className="text-xs text-gray-400">
                  O prueba llamando al número +56937924632
                 </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestGuard;