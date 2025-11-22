import React, { useState } from 'react';
import NewIncidentModal from './NewIncidentModal'; // Componente del modal
import { User, LogOut, Bell, FileText, Calendar, Plus } from 'lucide-react';

// Datos de ejemplo para la tabla
const initialIncidents = [
  { ID: 'INC001', Fecha: '2025-10-27 10:30', Tipo: 'Daño a bicicleta', Ubicacion: 'Bicicletero FACE', Severidad: 'Media', Descripcion: 'Bicicleta encontrada con rayones profundos en el marco', Estado: 'Pendiente' },
  { ID: 'INC002', Fecha: '2025-10-26 14:15', Tipo: 'Intento de robo', Ubicacion: 'Bicicletero Centro de Idiomas', Severidad: 'Alta', Descripcion: 'Se observó a una persona intentando forzar un candado', Estado: 'Resuelto' },
];

const IncidentesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos simulados para la tabla
  const incidents = [
    { id: 'INC001', date: '26-10-2025', loc: 'Bicicletero FACE', desc: 'Bicicleta encontrada con rayones profundos en el marco', imgs: 0, status: 'Pendiente' },
    { id: 'INC002', date: '25-10-2025', loc: 'Bicicletero Centro de Idiomas', desc: 'Se observó a una persona intentando forzar un candado', imgs: 0, status: 'Resuelto' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-blue-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-gray-200 text-blue-900 font-bold px-2 py-1 rounded">UBB</div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Panel de Guardia</h1>
            <p className="text-xs text-blue-200">Sistema de Gestión de Bicicletas UBB</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-200">
            <User size={18} />
            <span>Juan Pérez</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-200">
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Barra de Navegación Secundaria (Tabs simulados) */}
        <div className="grid grid-cols-3 gap-4 bg-gray-200 p-1 rounded-lg text-center text-sm font-medium text-gray-600">
          <div className="py-2 hover:bg-white rounded cursor-pointer">Gestión de Bicicletas</div>
          <div className="py-2 bg-white rounded shadow-sm text-gray-900 cursor-pointer">Informes de Incidentes</div>
          <div className="py-2 hover:bg-white rounded cursor-pointer">Gestión de Usuarios</div>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 text-sm font-medium">Incidentes Totales</span>
              <Bell size={18} className="text-gray-400" />
            </div>
            <div className="text-3xl font-medium text-gray-800">2</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 text-sm font-medium">Incidentes Pendientes</span>
              <FileText size={18} className="text-gray-400" />
            </div>
            <div className="text-3xl font-medium text-gray-800">1</div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-gray-600 text-sm font-medium">Informes Mensuales</span>
              <Calendar size={18} className="text-gray-400" />
            </div>
            <div className="text-3xl font-medium text-gray-800">1</div>
          </div>
        </div>

        {/* Sección Sistema de Informes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Sistema de Informes</h2>
            <p className="text-gray-500 text-sm mt-1">Registre y gestione incidentes individuales e informes mensuales</p>
            
            {/* Sub-tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 mt-4 max-w-2xl">
              <button className="flex-1 bg-white py-1.5 text-sm font-medium shadow-sm rounded-md text-gray-900">Incidentes Individuales</button>
              <button className="flex-1 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">Informes Mensuales</button>
            </div>

            {/* Botón Registrar */}
            <div className="flex justify-end mt-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <Plus size={18} />
                Registrar Incidente
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Bicicletero</th>
                  <th className="p-4 w-1/3">Descripción</th>
                  <th className="p-4 text-center">Imágenes</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{inc.id}</td>
                    <td className="p-4">{inc.date}</td>
                    <td className="p-4">{inc.loc}</td>
                    <td className="p-4 truncate max-w-xs" title={inc.desc}>{inc.desc}</td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs border border-gray-200">{inc.imgs} imágenes</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        inc.status === 'Pendiente' 
                          ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' 
                          : 'bg-gray-900 text-white'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Renderizar el Modal condicionalmente */}
      <NewIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onRegister={() => {
          alert("Incidente registrado (Lógica de backend aquí)");
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default IncidentesPage;