import { BarChart3, CheckCircle2, ParkingSquare, Users, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import AnimatedBarChart from '../../../components/AnimatedBarChart';
import AnimatedParking from '../../../components/AnimatedParking';
import AnimatedUsers from '../../../components/AnimatedUsers';
import AnimatedCheck from '../../../components/AnimatedCheck';
import AnimatedActivity from '../../../components/AnimatedActivity';

export default function VistaGeneralSistema({ kpi }) {

  const {
    capacidadTotal = 0,
    totalBicicletas = 0,
    ocupacionGlobal = 0
  } = kpi || {};

  const totalDisponibles = capacidadTotal - totalBicicletas;

  return (
    <div className="w-full bg-white border-y border-gray-100 p-6 md:p-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#0066cc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pop-in">
            <AnimatedBarChart size={24} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 w-full">

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <AnimatedParking size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Espacios</span>
            </div>
            <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{capacidadTotal}</p>
          </div>
          <div className="w-full bg-blue-600 h-1.5 rounded-full"></div>
        </div>

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                <AnimatedUsers size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ocupados</span>
            </div>
            <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{totalBicicletas}</p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${ocupacionGlobal}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                <AnimatedCheck size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Disponibles</span>
            </div>
            <p className="text-[44px] leading-tight font-bold text-gray-900 mb-4">{totalDisponibles}</p>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${100 - ocupacionGlobal}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                <AnimatedActivity size={18} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tasa Global</span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[44px] leading-tight font-bold text-gray-900">{ocupacionGlobal}%</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${ocupacionGlobal > 85 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                <TrendingUp size={10} /> {ocupacionGlobal > 85 ? 'Crítica' : 'Estable'}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${ocupacionGlobal}%` }}></div>
          </div>
        </div>

      </div>
    </div>
  );
}