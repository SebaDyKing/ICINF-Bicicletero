import { Shield, MapPin, Clock } from "lucide-react";

export const SolicitarButton = () => {
  return (
    <div className="bg-blue-600 rounded-2xl shadow-xl p-8 text-white text-center max-w-sm mx-auto relative overflow-hidden">
    
      <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-500 rounded-full opacity-30"></div>
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500 rounded-full opacity-30"></div>

    
      <div className="flex justify-center mb-6 relative z-10">
        <div className="bg-white text-blue-600 p-4 rounded-full shadow-lg">
          <Shield size={48} strokeWidth={1.5} />
        </div>
      </div>

   
      <h3 className="text-2xl font-bold mb-3 relative z-10">
        ¿Necesitas a la guardia?
      </h3>
      <p className="text-blue-100 text-sm mb-8 relative z-10">
        Solicita asistencia de seguridad para un bicicletero específico y
        un guardia acudirá al lugar
      </p>


      <button className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 w-full relative z-10">
        <MapPin size={20} />
        Solicitar Guardia
      </button>


      <p className="text-blue-200 text-xs mt-6 flex items-center justify-center gap-2 relative z-10">
        <Clock size={16} />
        Respuesta promedio: 5-10 minutos
      </p>
    </div>
  );
};