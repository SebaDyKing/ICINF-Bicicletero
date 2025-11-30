import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function GestionarBicicletarios() {
  const [activeId, setActiveId] = useState(1);

  //Datos momentaneos de bicicletarios
  const bicicletarios = [
    { id: 1, nombre: 'Gimnasio', ocupados: 45, total: 50 },
    { id: 2, nombre: 'Biblioteca', ocupados: 30, total: 45 },
    { id: 3, nombre: 'Ingreso Norte', ocupados: 42, total: 50 },
    { id: 4, nombre: 'Aulas', ocupados: 40, total: 40 },
  ];
//TODO : APlicar la logica del websocket para actualizar los datos en tiempo real

  const handleCardClick = (id) => {
    if (activeId === id) return; 
    setActiveId(id);
  };

  return (
    <div className="w-full bg-gray-50 p-6 font-sans min-h-screen">
      
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
        {bicicletarios.map((rack) => {
          const porcentaje = Math.round((rack.ocupados / rack.total) * 100);
          
          const isActive = activeId === rack.id;
          const isFull = rack.ocupados >= rack.total;

          return (
            <div 
              key={rack.id} 
              onClick={() => handleCardClick(rack.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-br from-[#003366] via-[#004080] to-[#0066cc] border-[#003366] shadow-2xl shadow-blue-500/30 transform scale-[1.02]' 
                  : 'bg-white text-gray-800 border-gray-200 hover:border-[#003366] hover:shadow-lg'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold text-lg ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {rack.nombre}
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
                {rack.ocupados} de {rack.total} ocupados
              </p>

              <div className={`w-full h-2.5 rounded-full mb-12 overflow-hidden ${isActive ? 'bg-black/20' : 'bg-gray-100'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${isActive ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-[#003366]'}`}
                  style={{ width: `${porcentaje}%` }}
                ></div>
              </div>

              <div className="absolute bottom-4 right-4 flex gap-2">
                 <button 
                   onClick={(e) => e.stopPropagation()} 
                   className={`p-2 rounded-lg transition-all backdrop-blur-sm ${
                   isActive 
                     ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
                     : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
                 }`}>
                   <Edit2 size={18} />
                 </button>
                 <button 
                   onClick={(e) => e.stopPropagation()} 
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
        })}
      </div>
    </div>
  );
}