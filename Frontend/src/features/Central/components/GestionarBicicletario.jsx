import { useState } from 'react';
import { Plus } from 'lucide-react';
import BicycleCard from './BicycleCard';

export default function GestionarBicicletarios() {
  const [activeId, setActiveId] = useState(1);

  const bicicletarios = [
    { id: 1, nombre: 'Gimnasio', ocupados: 45, total: 50 },
    { id: 2, nombre: 'Biblioteca', ocupados: 30, total: 45 },
    { id: 3, nombre: 'Ingreso Norte', ocupados: 42, total: 50 },
    { id: 4, nombre: 'Aulas', ocupados: 40, total: 40 },
  ];

  const handleCardClick = (id) => {
    if (activeId === id) return; 
    setActiveId(id);
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-3xl"> 
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestionar Bicicletarios</h1>
          <p className="text-gray-500 mt-1">Administración de infraestructura y capacidad</p>
        </div>
        
        <div className="flex items-center gap-4">
           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             Actualizado: hace 2 min
           </span>
           
           <button className="bg-gradient-to-br from-[#003366] to-[#005599] hover:from-[#002347] hover:to-[#004477] text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition hover:scale-105 active:scale-95">
             <Plus size={20} />
             Nuevo Bicicletario
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bicicletarios.map((rack) => (
          <BicycleCard 
            key={rack.id}
            data={rack}
            isActive={activeId === rack.id}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}