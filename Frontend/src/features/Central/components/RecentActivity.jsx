import React from 'react';
import { BikeIcon, PinIcon, ClockIcon, EntryIcon, ExitIcon } from '../../../utils/StatsIcons';

const movements = [
  { id: 1, name: 'María González', rut: '20.123.456-7', bikeId: 'BK-001', location: 'FACE', time: '14:32', type: 'entry', date: '18 Nov 2025' },
  { id: 2, name: 'Carlos Muñoz', rut: '19.876.543-2', bikeId: 'BK-045', location: 'Idiomas', time: '14:15', type: 'exit', date: '18 Nov 2025' },
  { id: 3, name: 'Ana Silva', rut: '21.234.567-8', bikeId: 'BK-023', location: 'Biblioteca', time: '13:58', type: 'entry', date: '18 Nov 2025' },
  { id: 4, name: 'Pedro Ramírez', rut: '20.345.678-9', bikeId: 'BK-067', location: 'Ingeniería', time: '13:45', type: 'exit', date: '18 Nov 2025' },
  { id: 5, name: 'Laura Torres', rut: '19.987.654-3', bikeId: 'BK-089', location: 'Deportes', time: '13:30', type: 'entry', date: '18 Nov 2025' },
  { id: 6, name: 'Diego Vásquez', rut: '20.456.789-0', bikeId: 'BK-012', location: 'Ciencias', time: '13:12', type: 'exit', date: '18 Nov 2025' },
];

export const RecentActivity = () => {
  return (
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
      
      
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl sticky top-0 z-10">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Últimos Movimientos</h3>
          <p className="text-xs text-gray-400 mt-1">Actividad en tiempo real</p>
        </div>
        <ClockIcon className="h-5 w-5 text-gray-400" />
      </div>

      
      <div className="overflow-y-auto flex-1 custom-scrollbar p-2">
        <div className="space-y-2">
          {movements.map((mov) => (
            <div key={mov.id} className="p-4 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-gray-100 group">
              
              
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-bold text-slate-700 text-sm">{mov.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">{mov.rut}</p>
                </div>
                
                
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                  ${mov.type === 'entry' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'}
                `}>
                  {mov.type === 'entry' ? <EntryIcon/> : <ExitIcon/>}
                  {mov.type === 'entry' ? 'Entrada' : 'Salida'}
                </span>
              </div>

              
              <div className="grid grid-cols-3 gap-2 mt-3">
                
                
                <div className="flex items-center text-gray-500 group-hover:text-slate-600">
                  <BikeIcon className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  <span className="text-xs font-medium">{mov.bikeId}</span>
                </div>

                
                <div className="flex items-center text-gray-500 group-hover:text-slate-600">
                  <PinIcon className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  <span className="text-xs font-medium truncate">{mov.location}</span>
                </div>

                
                <div className="flex items-center text-gray-500 group-hover:text-slate-600 justify-end">
                  <ClockIcon className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                  <span className="text-xs font-medium">{mov.date} - {mov.time}</span>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};