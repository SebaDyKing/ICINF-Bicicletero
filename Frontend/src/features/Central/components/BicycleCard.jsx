import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function BicycleCard({ data, isActive, onClick }) {
  const porcentaje = Math.round((data.ocupados / data.total) * 100);
  const isFull = data.ocupados >= data.total;

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
           onClick={(e) => { e.stopPropagation();}} 
           className={`p-2 rounded-lg transition-all backdrop-blur-sm ${
           isActive 
             ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10' 
             : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-[#003366]'
         }`}>
           <Edit2 size={18} />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation();}} 
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