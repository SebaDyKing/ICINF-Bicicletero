import HeaderOwner from "../components/HeaderOwner";
import CardBikes from "./CardBikes";
import RegisterBikeModal from "./RegisterBikeModal"; 
import { Plus, Bike } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @component Bikes
 * @brief Vista principal del panel de dueño ("Mis Bicicletas").
 * * Este componente actúa como contenedor y controlador de la lista de bicicletas.
 * Sus responsabilidades principales son:
 * 1. Mostrar el listado de bicicletas registradas (o un estado vacío).
 * 2. Gestionar la apertura del modal de registro.
 * 3. Sincronizar el estado local con el estado global/padre al agregar o eliminar ítems.
 * * @param {Object} props
 * @param {Object} props.user Información del usuario autenticado (necesario para el RUT al registrar).
 * @param {Array} props.bike Lista inicial de bicicletas proveniente del componente padre o API.
 * @param {Function} props.setBikes Función actualizadora del estado global de bicicletas en el padre.
 */
const Bikes = ({ user, bike, setBikes }) => {
  const [localBikes, setLocalBikes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sincronización: Si la lista de bicicletas cambia desde el padre (prop 'bike'),
  // actualizamos nuestro estado local para reflejarlo.
  useEffect(() => {
    if (bike) {
      setLocalBikes(bike);
    }
  }, [bike]);

  /**
   * @brief Callback ejecutado cuando un componente hijo (CardBikes) confirma una eliminación.
   * Filtra la bicicleta eliminada del estado local y propaga el cambio al padre.
   * @param {number|string} deletedId ID de la bicicleta eliminada.
   */
  const handleBikeDeleted = (deletedId) => {
    // Actualización local
    setLocalBikes((prevBikes) => 
      prevBikes.filter((b) => String(b.id_bicicleta) !== String(deletedId))
    );

    // Actualizacion global (padre)
    if (setBikes) {
        setBikes((prevBikes) => 
            prevBikes.filter((b) => String(b.id_bicicleta) !== String(deletedId))
        );
    }
  };

  /**
   * @brief Callback ejecutado cuando el modal completa un registro exitoso.
   * Agrega la nueva bicicleta a las listas local y global.
   * @param {Object} newBike Objeto de la bicicleta recién creada.
   */
  const handleBikeAdded = (newBike) => {
    // Local
    setLocalBikes((prevBikes) => [...prevBikes, newBike]);
    
    // Global
    if (setBikes) {
        setBikes((prevBikes) => [...prevBikes, newBike]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderOwner user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Mis Bicicletas
            </h1>
            <p className="hidden sm:block text-sm sm:text-base text-slate-500 max-w-2xl">
              Mantén tu lista de bicicletas al día para un ingreso ágil y seguro.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out active:scale-95 shrink-0"
          >
            <Plus
              size={20}
              className="group-hover:rotate-180 transition-transform duration-600"
            />
            <span className="text-sm sm:text-base">Agregar Bicicleta</span>
          </button>
        </div>

        { localBikes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 p-4 rounded-full mb-3">
              <Bike size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No tienes bicicletas registradas
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Registra tu primera bicicleta para comenzar.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto mb-10">
            {localBikes.map((item) => (
              <CardBikes
                key={item.id_bicicleta}
                bike={item}
                onDelete={handleBikeDeleted}
              />
            ))}
          </div>
        )}
      </main>

      <RegisterBikeModal 
        isOpen={isModalOpen}
        onClose={()=> setIsModalOpen(false)}
        onSuccess={handleBikeAdded}
        userRut={user?.rut}
      />

    </div>
  );
};

export default Bikes;