import { useState } from "react";
import { StatCardCentral } from "./StatCardCentral";
import { BikeIcon,TrendUpIcon,PinIcon,AlertIcon } from "../../../utils/StatsIcons.jsx";
import { BarchartCentral } from "./BarchartCentral.jsx";
import { ReportsMounth } from "./ReportsMounth.jsx";
import { RecentActivity } from "./RecentActivity.jsx";
export const DashboardStats = () => {
    //TODO : Rellenar con datos reales despues (fetching desde la API)
    const [stats,_setStats] = useState({ //Quitar _ cuando se use setStats
        totalBicicletas: 180,
        capacidadTotal: "Capacidad total del sistema",
        ocupacion: "58%",
        ocupacionSubtext: "+12% respecto al mes pasado",
        bicicleteroMasUsado: "Centro de Idiomas",
        usoBicicletero: "88% de ocupación",
        reportes: 7,
        reportesSubtext: "4 pendientes de resolución"
    }); 

    // TODO: UseEffect con socket.on('up date_stats')

    return (
        <div className="w-full mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Estadísticas del Sistema</h2>
            <p className="text-gray-500 text-sm mb-6">Métricas y análisis del uso de bicicleteros</p>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
               <StatCardCentral title="Total Bicicletas" value={stats.totalBicicletas} subtext={stats.capacidadTotal} trendColor="text-blue-600 bg-blue-50" icon={<BikeIcon className="h-6 w-6 text-blue-600"/>} />
               <StatCardCentral title="Ocupación Promedio" value={stats.ocupacion} subtext={stats.ocupacionSubtext} trendColor="text-emerald-500 bg-emerald-50" icon={<TrendUpIcon className="h-6 w-6 text-emerald-500"/>} />
               <StatCardCentral title="Bicicletero Más Usado" value={stats.bicicleteroMasUsado} subtext={stats.usoBicicletero} trendColor="text-indigo-500 bg-indigo-50" icon={<PinIcon className="h-6 w-6 text-indigo-500"/>} />
               <StatCardCentral title="Reportes Este Mes" value={stats.reportes} subtext={stats.reportesSubtext} trendColor="text-amber-500 bg-amber-50" icon={<AlertIcon className="h-6 w-6 text-amber-500"/>} />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
               
                <div className="lg:col-span-2 space-y-6">
                    
                    <BarchartCentral />
                    
                   
                    <ReportsMounth />
                </div>

                
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>

            </div>
        </div>
  );
}