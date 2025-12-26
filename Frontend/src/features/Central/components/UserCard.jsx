// UserCard.jsx
import { Edit2, Trash2, Bike, Clock, MapPin } from "lucide-react";

export default function UserCard({ user, onDelete }) {

  const getInitial = (name) => name.charAt(0).toUpperCase();

  return (
    <div 
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
          onClick={() => onDelete(user.id)}
          className="p-2.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all active:scale-95"
          title="Eliminar"
        >
          <Trash2 size={18} />
        </button>
      </div>

    </div>
  );
}
