import { Edit2, Trash2, AlertTriangle } from 'lucide-react'; 
import { toast } from 'sonner'; 
import { deleteBicicletero } from '../services/bicycleRack.service';

export default function BicycleCard({ data, isActive, onClick,onEdit }) {

  const porcentaje = Math.round((data.ocupados / data.total) * 100);
  const isFull = data.ocupados >= data.total;

  const handleDeleteClick = (e) => {
    e.stopPropagation(); 

    toast.custom((t) => (
      <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex flex-col gap-3 w-[320px] animate-in fade-in zoom-in duration-200">
        <div className="flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">¿Eliminar "{data.nombre}"?</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Esta acción es irreversible
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-1 pl-10">
          <button 
            onClick={() => toast.dismiss(t)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button 
            onClick={() => confirmDelete(t)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition shadow-sm shadow-red-200"
          >
            Confirmar
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const confirmDelete = async (toastId) => {
    toast.dismiss(toastId); 

    if (data.ocupados > 0) {
      toast.error("No se puede eliminar", {
        description: `El bicicletero tiene ${data.ocupados} bicicleta(s) activa(s). Debes retirarlas primero.`,
        duration: 4000,
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />, 
      });
      return; 
    }

    try {
      await deleteBicicletero(data.id); 

      toast.success('Bicicletero eliminado', {
        description: `Se ha enviado la orden de eliminar "${data.nombre}".`,
        duration: 3000,
        icon: <Trash2 className="w-5 h-5 text-red-700" />,
        className: `
          bg-red-50 text-red-900 border-red-500 
          !border-l-[4px] !border-l-red-500
        `,
        style: { borderLeftColor: 'rgb(239, 68, 68)' }
      });

    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar", {
       description: error.response?.data?.message || "Ocurrió un error inesperado."
      });
    }
  };

  return (
    <div 
      onClick={() => onClick(data.id)}
      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-br from-[#003366] via-[#004080] to-[#0066cc] border-[#003366] shadow-2xl shadow-blue-500/30 transform scale-[1.02]' 
          : 'bg-white text-gray-800 border-gray-200 hover:border-[#003366] hover:shadow-lg'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
          {data.nombre}
        </h3>
        
        {isActive && (
           <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-bold border border-white/20">
             {porcentaje}%
           </span>
        )}
        {isFull && !isActive && (
           <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">LLENO</span>
        )}
      </div>

      <p className={`text-sm mb-6 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
        {data.ocupados} de {data.total} ocupados
      </p>

      <div className={`w-full h-2.5 rounded-full mb-12 overflow-hidden ${isActive ? 'bg-black/20' : 'bg-gray-100'}`}>
        <div 
          className={`h-full rounded-full transition-all duration-700 ${isActive ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-[#003366]'}`}
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
         <button 
           onClick={(e) => { 
            e.stopPropagation();
            onEdit(data)

            }} 
           className={`p-2 rounded-lg transition-all backdrop-blur-sm ${
           isActive 
             ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
             : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
         }`}>
           <Edit2 size={18} />
         </button>
         
         <button 
           onClick={handleDeleteClick} 
           className={`p-2 rounded-lg transition-all backdrop-blur-sm ${
           isActive 
             ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
             : 'bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500'
         }`}>
           <Trash2 size={18} />
         </button>
      </div>
    </div>
  );
}