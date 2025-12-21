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

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Disponibilidad Total</h3>
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md animate-pulse-soft">
                                    <Bike className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="p-6 flex items-center justify-between">
                                <div>
                                    <div className="text-4xl font-bold text-slate-900">
                                        {data.kpi.capacidadTotal - data.kpi.totalBicicletas}
                                        <span className="text-lg text-slate-400 font-normal">/{data.kpi.capacidadTotal}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">Espacios Libres</p>
                                </div>

                                <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-4 border-slate-100">
                                    <div
                                        className="absolute inset-0 rounded-full border-4 border-blue-600"
                                        style={{ clipPath: `inset(0 0 ${100 - data.kpi.ocupacionGlobal}% 0)` }}
                                    ></div>
                                    <span className="font-bold text-blue-700">{data.kpi.ocupacionGlobal}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Flujo de Hoy</h3>
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md animate-pulse-soft">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="p-6 flex divide-x divide-slate-100">
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="bg-emerald-100 p-2 rounded-full mb-2">
                                        <ArrowUp className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">{data.kpi.ingresosHoy}</span>
                                    <span className="text-xs text-slate-500 uppercase">Ingresos</span>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center">
                                    <div className="bg-rose-100 p-2 rounded-full mb-2">
                                        <ArrowDown className="w-6 h-6 text-rose-600" />
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">{data.kpi.salidasHoy}</span>
                                    <span className="text-xs text-slate-500 uppercase">Salidas</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Ocupación por Bicicletero</h3>

                                <button
                                    className="bg-gradient-to-br from-[#003366] to-[#005599] hover:from-[#002347] hover:to-[#004477] text-white font-medium py-2.5 px-5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 flex items-center gap-2"
                                    onClick={() => setModoGestion(true)}
                                >
                                    <Bike size={18} />
                                    Gestionar Bicicleteros
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {data.racks.map((rack) => (
                                    <div key={rack.id_bicicletero}>
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="font-medium text-slate-700">{rack.nombre}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-slate-400">{rack.ocupados}/{rack.capacidad}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${getBadgeColor(rack.porcentaje_ocupacion)}`}>
                                                    {rack.porcentaje_ocupacion}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full transition-all duration-500 ${getProgressBarColor(rack.porcentaje_ocupacion)}`}
                                                style={{ width: `${rack.porcentaje_ocupacion}%` }}
                                            ></div>
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