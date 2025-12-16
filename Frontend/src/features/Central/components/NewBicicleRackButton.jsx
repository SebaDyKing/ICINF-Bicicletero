import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react"; 
import { toast } from "sonner"; 
import { createBicicletero } from "../services/bicicletero.service";

export function NewBicicleRackButton({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad_maxima: 15,
    latitud: "",
    longitud: "",
    imagen: "" 
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createBicicletero(formData);
      
      toast.success('¡Solicitud exitosa!', {
        description: 'Bicicletero creado correctamente',
        duration: 4000,
        icon: <CheckCircle2 className="w-5 h-5 text-green-700" />,
        className: `
          bg-green-50 
          text-green-900 
          border-green-500 
          !border-l-[4px] 
          !border-l-green-500
        `,
        style: {
          borderLeftColor: 'rgb(34, 197, 94)',
        }
      });
      onClose(); 

    } catch (error) {
      console.log("Error desde el servicio:", error);
      const serverMessage = error.response?.data?.message || "Ocurrió un error";
      toast.error("Error al crear", { description: serverMessage });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Nuevo Bicicletero</h2>
            <button onClick={onClose} type="button" className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                placeholder="Mínimo 3 caracteres"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
              <input 
                type="number" required min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                value={formData.capacidad_maxima}
                onChange={(e) => setFormData({...formData, capacidad_maxima: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                <input 
                  type="number" step="any" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                  placeholder="-33.44"
                  value={formData.latitud}
                  onChange={(e) => setFormData({...formData, latitud: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                <input 
                  type="number" step="any" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                  placeholder="-70.66"
                  value={formData.longitud}
                  onChange={(e) => setFormData({...formData, longitud: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen (Opcional)</label>
              <input 
                type="url"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                placeholder="https://ejemplo.com/foto.jpg"
                value={formData.imagen}
                onChange={(e) => setFormData({...formData, imagen: e.target.value})}
              />
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                type="button" onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button 
                type="submit" disabled={loading}
                className="flex-[1.5] bg-[#003366] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-[#002347] transition disabled:opacity-50"
              >
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}