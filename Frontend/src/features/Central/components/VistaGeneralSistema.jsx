import { BarChart3, CheckCircle2, ParkingSquare, Users, CheckCircle, Activity, TrendingUp } from 'lucide-react';

export default function VistaGeneralSistema() {

  const totalEspacios = 185;
  const totalOcupados = 157;
  const totalDisponibles = totalEspacios - totalOcupados;
  const porcentajeOcupacion = Math.round((totalOcupados / totalEspacios) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      
    
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
        
       
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700">
              <BarChart3 size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Vista General del Sistema</h2>
              <p className="text-gray-400 text-sm font-medium">Métricas en tiempo real</p>
            </div>
          </div>
          
          <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1.5">
            <CheckCircle2 size={14} strokeWidth={3} />
            Operativo
          </span>
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10">   
         
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <ParkingSquare size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Espacios</span>
              </div>
              <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{totalEspacios}</p>
            </div>
          
            <div className="w-full bg-blue-600 h-1.5 rounded-full"></div>
          </div>

          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ocupados</span>
              </div>
              <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{totalOcupados}</p>
            </div>
    
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 rounded-full" style={{ width: `${porcentajeOcupacion}%` }}></div>
            </div>
          </div>

          
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                  <CheckCircle size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Disponibles</span>
              </div>
              <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{totalDisponibles}</p>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${100 - porcentajeOcupacion}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                  <Activity size={18} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tasa Global</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[44px] leading-tight font-bold text-gray-900">{porcentajeOcupacion}%</p>
                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <TrendingUp size={10} /> Alta
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className="h-full bg-purple-600 rounded-full" style={{ width: `${porcentajeOcupacion}%` }}></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}