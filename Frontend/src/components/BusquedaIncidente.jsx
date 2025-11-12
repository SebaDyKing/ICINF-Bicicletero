import { Search, FileText } from "lucide-react";
import { SolicitarButton } from './SolicitarButton';

export const BusquedaIncidente = () => {
  const showGuardiaButton = true; 

  return (
    <section className="max-w-4xl mx-auto mt-16 px-4">
    
      <div className="text-center mb-10">
        <div className="flex justify-center mb-3">
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-md">
            <FileText size={36} />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Consulta de Incidentes
        </h2>
        <p className="text-base text-gray-600 mt-1 max-w-2xl mx-auto">
          Ingresa tu RUT para ver el historial completo de incidentes reportados
          en el sistema de biciclearios
        </p>
      </div>

   
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
       
        <div className="bg-blue-800 text-white px-5 py-3 text-lg font-medium flex items-center gap-2">
          <Search size={20} />
          Búsqueda por RUT
        </div>

   
        <div className="p-6 bg-white">
          {/* Campo de entrada */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            RUT (formato: 12345678-9)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: 12345678-9"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md"
            >
              <Search size={18} /> Buscar
            </button>
          </div>

      
          <div className="mt-6 bg-blue-100 rounded-lg p-3 text-sm border border-blue-200">
            <p className="text-gray-700 mb-2 font-medium">
              RUTs de ejemplo para prueba:
            </p>
            <div className="flex flex-wrap gap-2">
              {["12345678-9", "98765432-1", "11111111-1"].map((rut) => (
                <span
                  key={rut}
                  className="bg-white border border-blue-300 rounded-md 
                  px-3 py-1 text-blue-700 hover:bg-blue-50 cursor-pointer shadow-sm flex items-center justify-center"
                >
                  {rut}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

   
      {showGuardiaButton && (
        <div className="mt-24"> 
          <SolicitarButton />
        </div>
      )}
    </section>
  );
};