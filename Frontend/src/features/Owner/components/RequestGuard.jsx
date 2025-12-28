import { useState } from "react";
import {
    Shield,
    MapPin,
    Loader2,
    Check,
    CheckCircle,
    XCircle,
    Info
} from "lucide-react";
import { solicitarGuardService } from "../services/owner.service";
import HeaderOwner from "./HeaderOwner";

export const RequestGuard = ({ user }) => {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleRequestGuard = () => {
    setStatus("loading");
    setMessage("Obteniendo tu ubicación...");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Tu navegador no soporta geolocalización.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setMessage("Verificando ubicación y contactando guardias...");
          const data = await solicitarGuardService(latitude, longitude);
          setStatus("success");
          setMessage(data.message || "Solicitud enviada correctamente.");
        } catch (error) {
          setStatus("error");
          const errorMsg = error.message || "No se pudo procesar la solicitud.";
          setMessage(errorMsg);
        }
      },
      (error) => {
        console.error("Error GPS:", error);
        setStatus("error");
        let gpsMsg = "No se pudo obtener la ubicación.";
        if (error.code === 1) gpsMsg = "Debes permitir el acceso a la ubicación.";
        if (error.code === 2) gpsMsg = "Ubicación no disponible (enciende el GPS).";
        if (error.code === 3) gpsMsg = "Se agotó el tiempo para obtener la ubicación.";
        setMessage(gpsMsg);
      },
      options
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderOwner user={user} />

      <div className="flex-1 px-4 py-8 md:px-8 max-w-7xl mx-auto w-full">

        <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Solicitud de Asistencia</h1>
            <p className="text-gray-500">Contacta con seguridad del campus en caso de emergencia.</p>
        </div>

        <div className="flex justify-center">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="bg-blue-50 p-8 flex flex-col items-center justify-center border-b border-blue-100">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <Shield className="w-16 h-16 text-blue-900" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold text-blue-900 text-center">
                        ¿Necesitas ayuda en el bicicletero?
                    </h2>
                </div>

                <div className="p-8">
                    <div className="mb-8 bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start">
                        {/* Icono de Ubicación (Lucide MapPin) */}
                        <MapPin className="w-5 h-5 text-yellow-600 mr-2 shrink-0" />
                        <p className="text-sm text-yellow-800 leading-relaxed">
                            <strong>Requisito de seguridad:</strong> El sistema verificará tu ubicación GPS. Debes estar en un radio de <strong>50 metros</strong> de un bicicletero.
                        </p>
                    </div>

                    <button
                        onClick={handleRequestGuard}
                        disabled={status === "loading" || status === "success"}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-lg shadow-md transition-all duration-200 transform
                        ${status === "loading"
                            ? "bg-gray-100 text-gray-500 cursor-wait border border-gray-200 shadow-none"
                            : status === "success"
                            ? "bg-green-600 text-white cursor-default shadow-green-200 hover:shadow-none"
                            : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-red-100 hover:shadow-lg"
                        }`}
                    >
                        {status === "loading" ? (
                            <div className="flex items-center justify-center gap-3">
                                <Loader2 className="animate-spin h-6 w-6" />
                                <span>Verificando ubicación...</span>
                            </div>
                        ) : status === "success" ? (
                            <span className="flex items-center justify-center gap-2">
                                <Check className="w-7 h-7" strokeWidth={3} />
                                Solicitud Enviada
                            </span>
                        ) : (
                            "📢 SOLICITAR GUARDIA"
                        )}
                    </button>

                    {/* Feedback y Mensajes de Estado */}
                    {message && (
                        <div className={`mt-6 p-4 rounded-lg text-sm border flex items-start gap-3 animate-fade-in transition-colors duration-300
                            ${status === "error" ? "bg-red-50 text-red-700 border-red-100" : ""}
                            ${status === "success" ? "bg-green-50 text-green-700 border-green-100" : ""}
                            ${status === "loading" ? "bg-blue-50 text-blue-700 border-blue-100" : ""}
                        `}>
                            <div className="mt-0.5 shrink-0">
                                {status === "success" && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {status === "error" && <XCircle className="w-5 h-5 text-red-600" />}
                                {status === "loading" && <Info className="w-5 h-5 text-blue-600" />}
                            </div>
                            <span className="font-medium leading-snug">{message}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RequestGuard;