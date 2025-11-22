import React from 'react';
import { Bike, MapPin, Clock, ArrowUp, ArrowDown } from 'lucide-react';


export const RecentActivity = ({movements}) => {
  const activityList = movements || [];

  return (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-hidden flex flex-col">   
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-slate-700">Últimos Movimientos</h3>
        </div>
        <Clock className="h-5 w-5 text-slate-400" />
      </div>

      <div className="overflow-y-auto flex-1 p-0 max-h-[400px]">
        {activityList.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
                Sin actividad reciente
            </div>
        ) : (
            <div className="divide-y divide-slate-50">
            {activityList.map((mov) => (
                <div key={mov.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-3">
                    
                    {/* Icono Circular */}
                    <div className={`p-2 rounded-full ${
                        mov.tipo === 'Ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                        {mov.tipo === 'Ingreso' ? <ArrowUp size={18}/> : <ArrowDown size={18}/>}
                    </div>

                    {/* Info Principal */}
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <h4 className="font-bold text-slate-700 text-sm">{mov.bici}</h4>
                            <span className="text-xs text-slate-400">
                                {new Date(mov.hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                             <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                mov.tipo === 'Ingreso' 
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                : 'bg-rose-50 border-rose-100 text-rose-700'
                             }`}>
                                {mov.tipo}
                             </span>
                             
                             <div className="flex items-center text-slate-500 text-xs">
                                <MapPin size={10} className="mr-1"/>
                                {mov.ubicacion}
                             </div>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};