import { useState } from "react";
import { StatCardCentral } from "./StatCardCentral";
import { BarchartCentral } from "./BarchartCentral.jsx";
import { WeeklyChart } from "./WeeklyChart.jsx";
import { RecentActivity } from "./RecentActivity.jsx";
import { Bike, Activity, ArrowUp, ArrowDown, LayoutDashboard } from "lucide-react";
import { BicicletarioManagment } from "./BicycleManagement.jsx";
import { useDashboardData } from "../hooks/useDashboardData.js";
import { Toaster } from "sonner";

export const DashboardStats = () => {
    const [modoGestion, setModoGestion] = useState(false);

    const data = useDashboardData();

    const getProgressBarColor = (percent) => {
        if (percent > 90) return "bg-indigo-500";
        if (percent > 60) return "bg-blue-500";
        return "bg-emerald-400";
    }

    const getBadgeColor = (percent) => {
        if (percent > 90) return "bg-indigo-50 text-indigo-700";
        if (percent > 60) return "bg-blue-50 text-blue-700";
        return "bg-emerald-50 text-emerald-700";
    };

    return (
        <div>
            <Toaster
                position="top-right"
                richColors
                expand
                toastOptions={{
                    style: { zIndex: 99999 }
                }}
            />
            {modoGestion ? (
                <BicicletarioManagment
                    dataGlobal={data}
                    onBack={() => setModoGestion(false)}
                />
            ) : (
                <div className="w-full min-h-screen bg-slate-100 p-6">
                    <header className="mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-[#003366] to-[#0066cc] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 animate-pulse-soft">
                                <LayoutDashboard size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Dashboard Operativo</h2>
                                <p className="text-slate-500 text-sm">Monitoreo en tiempo real</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="relative bg-[#0066cc] px-6 py-4 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

                                <div className="relative flex justify-between items-center text-white">
                                    <h3 className="font-bold text-lg tracking-tight">Disponibilidad Total</h3>
                                    <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-lg bounce-slow">
                                        <Bike className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            {data.kpi.capacidadTotal - data.kpi.totalBicicletas}
                                        </span>
                                        <span className="text-2xl font-bold text-slate-400">/{data.kpi.capacidadTotal}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                                        Espacios Libres
                                    </p>
                                </div>

                                <div className="relative">
                                    <svg className="w-24 h-24 transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="currentColor"
                                            strokeWidth="8"
                                            fill="none"
                                            className="text-slate-100"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="url(#gradient-blue)"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - data.kpi.ocupacionGlobal / 100)}`}
                                            className="transition-all duration-1000 drop-shadow-lg"
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#0066cc" />
                                                <stop offset="100%" stopColor="#00aaff" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                            {data.kpi.ocupacionGlobal}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flujo de Hoy */}
                        <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                            <div className="relative bg-fuchsia-600 px-6 py-4 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

                                <div className="relative flex justify-between items-center text-white">
                                    <h3 className="font-bold text-lg tracking-tight">Flujo de Hoy</h3>
                                    <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-lg bounce-slow">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-2 gap-4">
                                {/* Ingresos */}
                                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-emerald-200/60 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                        <ArrowUp className="w-4 h-4 text-white" strokeWidth={3} />
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                            {data.kpi.ingresosHoy}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wide">Ingresos</div>
                                    </div>
                                </div>

                                {/* Salidas */}
                                <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-red-200/60 hover:shadow-lg hover:scale-105 transition-all duration-300">
                                    <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                                        <ArrowDown className="w-4 h-4 text-white" strokeWidth={3} />
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-3xl font-black bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                            {data.kpi.salidasHoy}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-wide">Salidas</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group">
                            <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

                                <div className="relative flex justify-between items-center">
                                    <h3 className="font-bold text-lg text-white tracking-tight">Ocupación por Bicicletero</h3>

                                    <button
                                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 border border-white/30"
                                        onClick={() => setModoGestion(true)}
                                    >
                                        <Bike size={18} />
                                        Gestionar Bicicleteros
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 space-y-5">
                                {data.racks.map((rack, index) => (
                                    <div
                                        key={rack.id_bicicletero}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-slate-800">{rack.nombre}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold text-slate-500">{rack.ocupados}/{rack.capacidad}</span>
                                                <span className={`text-sm font-bold px-3 py-1 rounded-lg ${getBadgeColor(rack.porcentaje_ocupacion)} shadow-sm`}>
                                                    {rack.porcentaje_ocupacion}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative w-full bg-slate-200/60 rounded-full h-4 overflow-hidden shadow-inner">
                                            <div
                                                className={`h-4 rounded-full transition-all duration-700 ease-out shadow-lg ${getProgressBarColor(rack.porcentaje_ocupacion)}`}
                                                style={{
                                                    width: `${rack.porcentaje_ocupacion}%`,
                                                    background: rack.porcentaje_ocupacion > 90
                                                        ? 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)'
                                                        : rack.porcentaje_ocupacion > 60
                                                            ? 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)'
                                                            : 'linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%)'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent animate-shimmer" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <RecentActivity movements={data.actividad} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BarchartCentral data={data.graficos.porHora} />
                        <WeeklyChart data={data.graficos.semanal} />
                    </div>
                </div>
            )}
        </div>
    );
}