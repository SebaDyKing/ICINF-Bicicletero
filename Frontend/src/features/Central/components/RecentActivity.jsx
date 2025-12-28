import React from 'react';
import { MapPin, Clock, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';

export const RecentActivity = ({ movements }) => {
    const activityList = movements || [];


    return (
        <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 h-full overflow-hidden flex flex-col font-sans backdrop-blur-sm">
            <div className="relative bg-[#0066cc] px-6 py-5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

                <div className="relative flex items-center gap-3 text-white">
                    <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl shadow-lg bounce-slow">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-tight">Actividad Reciente</h3>
                        <p className="text-white/80 text-xs font-medium mt-0.5">Usuarios en tiempo real</p>
                    </div>
                </div>
            </div>

            <div className="overflow-y-auto flex-1 p-4">
                {activityList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4 float-anim">
                                <Clock className="h-10 w-10 text-blue-500" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
                        </div>
                        <p className="font-semibold text-slate-600 text-sm">Sin actividad reciente</p>
                        <p className="text-slate-400 text-xs mt-1">Los movimientos aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activityList.map((activity, index) => {
                            const isRetiro = activity.estado?.toLowerCase().includes('salida') ||
                                activity.estado?.toLowerCase().includes('retiro') ||
                                activity.tipo?.toLowerCase() === 'salida';

                            return (
                                <div
                                    key={`${activity.id}-${index}`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                    className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 slide-in"
                                >
                                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isRetiro ? 'bg-gradient-to-r from-rose-50/50 to-pink-50/50' : 'bg-gradient-to-r from-blue-50/50 to-cyan-50/50'}`} />

                                    <div className="relative z-10">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 ${isRetiro ? 'bg-gradient-to-br from-rose-300 via-rose-400 to-rose-500 shadow-rose-400/50' : 'bg-gradient-to-br from-[#003366] via-[#0055aa] to-[#0066cc] shadow-blue-500/50'}`}>
                                            {isRetiro ? (
                                                <ArrowDown size={26} strokeWidth={2.5} className="group-hover:animate-bounce" />
                                            ) : (
                                                <ArrowUp size={26} strokeWidth={2.5} className="group-hover:animate-bounce" />
                                            )}
                                        </div>
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${isRetiro ? 'bg-rose-300' : 'bg-cyan-400'}`} />
                                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${isRetiro ? 'bg-rose-400' : 'bg-cyan-500'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0 relative z-10">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-800 text-base truncate pr-2 group-hover:text-blue-700 transition-colors">
                                                {activity.nombre}
                                            </h4>
                                            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border ${isRetiro ? 'bg-white text-rose-600 border-rose-200' : 'bg-white text-blue-600 border-blue-200'}`}>
                                                {activity.horaEntrada}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 ${isRetiro ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200' : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'}`}>
                                                <div className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${isRetiro ? 'bg-rose-400 shadow-rose-400/50' : 'bg-emerald-500 shadow-emerald-500/50'}`} />
                                                {activity.tagBici}
                                            </span>

                                            <div className="flex items-center gap-1 text-slate-600 text-xs px-2.5 py-1 bg-blue-50 rounded-full truncate border border-blue-100">
                                                <MapPin size={11} className="flex-shrink-0 text-blue-500" />
                                                <span className="truncate font-medium">{activity.ubicacion}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`absolute right-0 top-0 w-1.5 h-full rounded-r-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRetiro ? 'bg-gradient-to-b from-rose-400 via-rose-500 to-rose-400' : 'bg-gradient-to-b from-[#0066cc] via-[#0088ee] to-[#00aaff]'}`} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};