import { useState } from 'react';
import { Search, Edit2, Trash2, Bike, Clock, MapPin } from 'lucide-react';

export function AccessControl  () {

  //TO DO : Eliminar y colocar por el websocket del backend
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Carlos Rodríguez",
      rut: "18.234.567-8",
      status: "En recinto",
      bikeId: "402",
      entryTime: "08:30 AM",
      colorFrom: "from-blue-600",
      colorTo: "to-blue-400"
    },
    {
      id: 2,
      name: "María González",
      rut: "19.876.543-2",
      status: "En recinto",
      bikeId: "158",
      entryTime: "08:45 AM",
      colorFrom: "from-purple-600",
      colorTo: "to-purple-400"
    },
    {
      id: 3,
      name: "Pedro Martínez",
      rut: "17.654.321-9",
      status: "En recinto",
      bikeId: "291",
      entryTime: "09:00 AM",
      colorFrom: "from-fuchsia-600",
      colorTo: "to-pink-400"
    },
    {
      id: 4,
      name: "Ana Silva",
      rut: "20.123.456-7",
      status: "En recinto",
      bikeId: "076",
      entryTime: "09:15 AM",
      colorFrom: "from-teal-500",
      colorTo: "to-emerald-400"
    },
    {
      id: 5,
      name: "Luis Fernández",
      rut: "18.765.432-1",
      status: "En recinto",
      bikeId: "314",
      entryTime: "09:30 AM",
      colorFrom: "from-indigo-600",
      colorTo: "to-indigo-400"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

   //TO DO : Eliminar y colocar por el websocket del backend
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.rut.includes(searchTerm) ||
    user.bikeId.includes(searchTerm)
  );

   //TO DO : Eliminar y colocar por el websocket del backend
  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      setUsers(users.filter(user => user.id !== id));
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
            filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="group relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-transparent hover:border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full"
              >
                
                <div className="flex items-center gap-5 w-full md:w-auto">
                  <div className={`
                    h-16 w-16 min-w-[4rem] rounded-2xl flex items-center justify-center 
                    bg-gradient-to-br ${user.colorFrom} ${user.colorTo} 
                    shadow-lg shadow-gray-200 text-white text-2xl font-bold
                    transform group-hover:scale-105 transition-transform duration-300
                  `}>
                    {getInitial(user.name)}
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {user.name}
                    </h3>
                    <span className="text-sm text-gray-500 font-mono mt-1">ID: {user.rut}</span>
                    
                    <div className="flex md:hidden items-center gap-2 mt-2">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {user.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 md:gap-6 w-full md:w-auto pl-2 md:pl-0 border-l-2 border-gray-100 md:border-none">
                  
                  <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                    <MapPin size={14} className="mr-1.5" />
                    {user.status}
                  </div>

                  <div className="flex items-center px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-sm font-medium border border-purple-100">
                    <Bike size={16} className="mr-2" />
                    #{user.bikeId}
                  </div>

                  <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium border border-gray-200">
                    <Clock size={16} className="mr-2" />
                    {user.entryTime}
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
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300 w-full">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                <Search className="w-full h-full" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
              <p className="mt-1 text-sm text-gray-500">Prueba buscando por otro nombre o ID.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
