import { useState } from 'react';
import { Search, Edit2, Trash2, Bike, Clock, MapPin } from 'lucide-react';

export function AccessControl({ actividad = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const getGradientColor = (inicial) => {
    const charCode = inicial ? inicial.charCodeAt(0) : 0;
    const gradients = [
      { from: "from-blue-600", to: "to-blue-400" },
      { from: "from-purple-600", to: "to-purple-400" },
      { from: "from-fuchsia-600", to: "to-pink-400" },
      { from: "from-teal-500", to: "to-emerald-400" },
      { from: "from-indigo-600", to: "to-indigo-400" },
      { from: "from-orange-500", to: "to-amber-400" },
    ];
    return gradients[charCode % gradients.length];
  };

  const filteredUsers = actividad.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rut.includes(searchTerm) ||
    user.tagBici.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      console.log("Eliminar ID:", id);
    }
  };

  return (
    <div className="w-full bg-gray-50 font-sans p-6 md:p-8">
      <div className="w-full space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Control de Acceso</h1>
            <p className="text-gray-500 text-sm mt-1">Gestión de bicicletas y usuarios en recinto</p>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-3 border-none rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-gray-400 text-gray-700"
              placeholder="Buscar por nombre, RUT o ID de bici..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 w-full">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const colors = getGradientColor(user.inicial);

              return (
                <div 
                  key={user.id} 
                  className="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full animate-in fade-in slide-in-from-bottom-2"
                >
                  
                  <div className="flex items-center gap-5 w-full md:w-auto">
                    <div className={`
                      h-16 w-16 min-w-[4rem] rounded-2xl flex items-center justify-center 
                      bg-gradient-to-br ${colors.from} ${colors.to} 
                      shadow-lg shadow-gray-200 text-white text-2xl font-bold
                      transform group-hover:scale-105 transition-transform duration-300
                    `}>
                      {user.inicial}
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {user.nombre}
                      </h3>
                      <span className="text-sm text-gray-500 font-mono mt-1">RUT: {user.rut}</span>
                      
              
                      <div className="flex md:hidden items-center gap-2 mt-2">
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {user.estado}
                        </span>
                      </div>
                    </div>
                  </div>

       
                  <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto pl-2 md:pl-0 border-l-2 border-gray-100 md:border-none">
                    
                    <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                      <MapPin size={14} className="mr-1.5" />
                      {user.estado}
                    </div>

                    <div className="flex items-center px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                      <Bike size={16} className="mr-2" />
                    
                      {user.tagBici}
                    </div>

                    <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-200">
                      <Clock size={16} className="mr-2" />
                      {user.horaEntrada}
                    </div>
                  </div>

           
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t pt-4 md:pt-0 md:border-t-0 border-gray-100 mt-2 md:mt-0">
                    <button 
                      className="p-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 w-full">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No hay usuarios en recinto</h3>
              <p className="mt-1 text-sm text-gray-500">Esperando nuevos ingresos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};