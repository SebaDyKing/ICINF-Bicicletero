import { useState, useEffect } from "react";
import { X, Save, AlertTriangle } from "lucide-react"; 
import { toast } from "sonner";
import { createBicicletero, updateBicicletero } from "../services/bicycleRack.service";
import { LocationPicker } from "./LocationPicker";

export function NewBicicleRackButton({ isOpen, onClose, initialData }) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData; 

  const [formData, setFormData] = useState({
    nombre: "",
    capacidad_maxima: 15,
    latitud: "",
    longitud: "",
    imagen: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          nombre: initialData.nombre || "",
          capacidad_maxima: initialData.capacidad || initialData.total || 15, 
          latitud: initialData.latitud || "",
          longitud: initialData.longitud || "",
          imagen: initialData.imagen || ""
        });
      } else {
        setFormData({
          nombre: "",
          capacidad_maxima: 15,
          latitud: "",
          longitud: "",
          imagen: ""
        });
      }
    }
  }, [isOpen, initialData]); 

  const handleLocationChange = (lat, lng) => {
    setFormData(prev => ({ ...prev, latitud: lat, longitud: lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.latitud || !formData.longitud) {
      toast.error("Debes seleccionar una ubicación en el mapa");
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const ocupacionActual = initialData.ocupados || 0;
        const nuevaCapacidad = Number(formData.capacidad_maxima);

        if (nuevaCapacidad < ocupacionActual) {
          toast.error('No se puede reducir la capacidad', {
            description: `Hay ${ocupacionActual} bicicletas estacionadas. Mínimo: ${ocupacionActual}.`,
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />, 
          });
          setLoading(false);
          return; 
        }

        await updateBicicletero(initialData.id, formData);
        toast.success('Actualizado correctamente', { icon: <Save className="text-blue-600" /> });
      } else {
        await createBicicletero(formData);
        toast.success('Creado correctamente');
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const overlayClasses = isOpen 
    ? "opacity-100 visible pointer-events-auto" 
    : "opacity-0 invisible pointer-events-none delay-100";

  const modalClasses = isOpen 
    ? "scale-100 opacity-100 translate-y-0" 
    : "scale-95 opacity-0 translate-y-4";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${overlayClasses}`}>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />
      <div 
        className={`
          bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10
          transition-all duration-300 ease-out 
          ${modalClasses}
        `}
      >
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditing ? 'Editar Bicicletero' : 'Nuevo Bicicletero'}
            </h2>
            <button onClick={onClose} type="button" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input 
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                value={formData.nombre} 
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
              <input 
                type="number" required min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#003366] transition-all"
                value={formData.capacidad_maxima}
                onChange={(e) => setFormData({...formData, capacidad_maxima: e.target.value})}
              />
            </div>

            <LocationPicker 
              lat={formData.latitud} 
              lng={formData.longitud} 
              onChange={handleLocationChange} 
            />

            <div className="flex gap-3 mt-8">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className={`flex-[1.5] text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-900/10
                  ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#003366] hover:bg-[#002347]'}
                  disabled:opacity-70 disabled:cursor-not-allowed
                `}
              >
                {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}