import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { deleteBicicletero } from "../services/bicycleRack.service";

export const DeleteBicicleteroButton = ({ id, nombre, onSuccess }) => {

  const handleDelete = async () => {

    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-3 w-[300px]">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">¿Eliminar Bicicletero?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Estás a punto de borrar <strong>"{nombre}"</strong>. Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button 
            onClick={() => confirmDelete(id, t)}
            className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    ), { duration: Infinity }); 
  };

  const confirmDelete = async (id, toastId) => {
    toast.dismiss(toastId); 

    try {
      await deleteBicicletero(id);
      
      toast.success('Eliminado correctamente', {
        description: `El bicicletero "${nombre}" ha sido borrado.`,
        duration: 4000,
        icon: <Trash2 className="w-5 h-5 text-red-700" />,
        className: `
          bg-red-50 
          text-red-900 
          border-red-500 
          !border-l-[4px] 
          !border-l-red-500
        `,
        style: {
          borderLeftColor: 'rgb(239, 68, 68)', 
        }
      });
      

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      toast.error("No se pudo eliminar", {
        description: error.response?.data?.message || "Error de conexión"
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
      title="Eliminar bicicletero"
    >
      <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
    </button>
  );
};