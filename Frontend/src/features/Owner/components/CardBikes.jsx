import { Bike, Trash2, Calendar } from "lucide-react";
import Swal from "sweetalert2";
import { deleteBicycleService } from "../services/bicycle.service";
import { useState } from "react";

/**
 * @component BikeCard
 * @brief Componente visual tipo tarjeta para mostrar el resumen de una bicicleta.
 *
 * Muestra información clave como alias, marca, modelo, color y estado de estacionamiento.
 * Incluye la lógica completa para eliminar la bicicleta: confirmación con modal (Swal),
 * llamada al servicio asíncrono y retroalimentación visual al usuario (Toast).
 *
 * @param {Object} props Props del componente.
 * @param {Object} props.bike Objeto con los datos de la bicicleta (id_bicicleta, alias, isParked, etc.).
 * @param {Function} [props.onDelete] Callback opcional que se ejecuta tras una eliminación exitosa para actualizar la lista padre.
 * @returns {JSX.Element|null} Renderiza la tarjeta o null si no hay datos de bicicleta.
 */
const BikeCard = ({ bike, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!bike) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDeleteBicycle = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar bicicleta?",
      text: `Se borrará "${bike.alias}". Esta acción es irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!confirm.isConfirmed) return;

    setIsDeleting(true);
    try {
      await deleteBicycleService(bike.id_bicicleta);

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({
        icon: "success",
        title: "Bicicleta eliminada correctamente",
      });

      if (onDelete) {
        onDelete(bike.id_bicicleta);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudo eliminar.",
        icon: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group w-full">
      <div className="p-5 w-full bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Bike size={24} />
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-800 text-xl leading-tight truncate">
              {bike.alias}
            </h3>

            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                {bike.tipo}
              </span>

              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1
                    ${
                      bike.isParked
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    bike.isParked
                      ? "bg-green-500 animate-pulse"
                      : "bg-slate-400"
                  }`}
                ></div>
                {bike.isParked ? "Estacionada" : "No Estacionada"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grow flex flex-col justify-center">
        <div className="grid grid-cols-3 gap-4 w-full text-sm">
          <div className="flex flex-col gap-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Marca
            </p>
            <p className="text-slate-700 font-medium text-base truncate">
              {bike.marca}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Modelo
            </p>
            <p className="text-slate-700 font-medium text-base truncate">
              {bike.modelo}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
              Color
            </p>
            <div className="flex items-center gap-2">
              <p className="text-slate-700 font-medium text-base capitalize truncate">
                {bike.color}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Calendar size={14} />
          <span>Registrada: {formatDate(bike.fecha_creacion)}</span>
        </div>

        <button
          onClick={handleDeleteBicycle}
          disabled={isDeleting}
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all border
            ${
              isDeleting
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                : "bg-white text-red-600 border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 hover:shadow-sm"
            }`}
        >
          <Trash2 size={14} />
          {isDeleting ? "..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};

export default BikeCard;
