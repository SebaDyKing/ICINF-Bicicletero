import { useState } from 'react';
import { Search, Bike, Clock, ShieldCheck } from 'lucide-react';
import { getGradientColor } from '../utils/getGradientColor';

export function AccessControl({ actividad = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = actividad.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rut.includes(searchTerm) ||
    user.tagBici.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full bg-slate-100 p-6">
      <div className="relative bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-6">
        <div className="relative bg-gradient-to-r from-orange-700 to-orange-900 px-6 py-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl shadow-lg bounce-slow">
                <ShieldCheck size={28} strokeWidth={2.5} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Control de Acceso</h1>
                <p className="text-white/80 text-sm font-medium mt-0.5">Monitoreo en tiempo real de usuarios en recinto</p>
              </div>
            </div>

            <div className="relative w-full md:w-96 group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border-none rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder-gray-400 text-gray-700"
                placeholder="Buscar por nombre, RUT o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">

          <div className="space-y-4 w-full">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const colors = getGradientColor(user.inicial);

                return (
                  <div
                    key={user.id}
                    className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row items-center justify-between overflow-hidden cursor-default w-full"
                  >
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-emerald-50/50 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-5 relative z-10 w-full md:w-auto">
                      <div className={`
                      h-12 w-12 min-w-[3rem] rounded-xl flex items-center justify-center 
                      text-white text-lg font-bold shadow-lg 
                      bg-gradient-to-br ${colors.from} ${colors.to}
                      group-hover:scale-105 transition-transform
                    `}>
                        {user.inicial}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:translate-x-1 transition-transform duration-300">{user.nombre}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5 font-medium">
                          <span>{user.rut}</span>
                          <span className="text-gray-300">|</span>
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <Bike size={12} />
                            {user.tagBici}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto justify-end mt-4 md:mt-0 pl-0 md:pl-6 border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">

                      <div className="flex-1 md:flex-none md:min-w-[120px] px-4 py-2 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-2 group-hover:border-gray-300 transition-colors justify-center clock-stomp">
                        <Clock size={16} className="text-gray-400" />
                        <span className="font-semibold text-gray-600 text-sm">{user.horaEntrada}</span>
                      </div>

                      <div className="flex-1 md:flex-none md:min-w-[120px] px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 font-medium flex items-center gap-2 shadow-sm text-sm justify-center">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        {user.estado || "En Recinto"}
                      </div>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 w-full">
                <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No hay resultados</h3>
                <p className="mt-1 text-sm text-gray-500">No se encontraron usuarios con ese criterio.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}