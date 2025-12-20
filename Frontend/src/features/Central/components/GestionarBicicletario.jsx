import { useState,useEffect} from 'react';
import { Plus,ArrowLeft } from 'lucide-react';
import BicycleCard from './BicycleCard';
import { NewBicicleRackButton } from './NewBicicleRackButton';

export function GestionarBicicletarios({racks = [],onBack}) {
  const [activeId, setActiveId] = useState(1);
  const [isModalOpen,setIsModalOpen] = useState(false)
  const [editingData,setEditingData] = useState(null)

  const bicicleterosData = racks.map((rack) => ({
    id: rack.id_bicicletero,
    nombre: rack.nombre,
    ocupados: rack.ocupados,
    total: rack.capacidad ,
    latitud: rack.latitud, 
    longitud: rack.longitud,
    imagen: rack.imagen
  }))

    useEffect(() => {
        if (bicicleterosData.length > 0) {
            const idExiste = bicicleterosData.find(b => b.id === activeId);
            
            if (activeId === null || !idExiste) {
                setActiveId(bicicleterosData[0].id);
            }
        }
    }, [bicicleterosData, activeId]);

  const handleCardClick = (id) => {
    if (activeId === id) return; 
    setActiveId(id);
  };

  const onEdit = (data) => {
  setEditingData(data)
  setIsModalOpen(true)
  }
  return (
        <div className="w-full bg-gray-50 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#003366] transition-colors mb-2 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Volver al panel</span>
                    </button>
                                <h1 className="text-3xl font-bold text-gray-900">Gestionar Bicicletarios</h1>
                    <p className="text-gray-500 mt-1">Administración de infraestructura y capacidad</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        En línea
                    </span>
                    
                    <button 
                    className="bg-gradient-to-br from-[#003366] to-[#005599] hover:from-[#002347] hover:to-[#004477] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition hover:scale-105 active:scale-95"
                    onClick={() => {
                    setEditingData(null)
                    setIsModalOpen(true)
               }
                    }
                    >
                        <Plus size={20} />
                        Nuevo Bicicletario
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {bicicleterosData.length > 0 ? (
                    bicicleterosData.map((rack) => (
                        <BicycleCard
                            key={rack.id}
                            data={rack}
                            isActive={activeId === rack.id}
                            onClick={handleCardClick}
                            onEdit={onEdit}
                            
                        />
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-4 py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                        <p>Esperando datos del servidor...</p>
                    </div>
                )}
            </div>
            <NewBicicleRackButton
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialData = {editingData}
                 />
    </div>
  );
}