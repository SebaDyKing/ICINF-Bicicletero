import React, { useState, useEffect, useRef } from 'react';
import NewIncidentModal from './NewIncidentModal'; // Componente del modal
import { User, LogOut, Bell, FileText, Calendar, Plus, Edit, X, Trash2 } from 'lucide-react';
import axios from 'axios'

const IncidentesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [reports, setReports] = useState([]);
  const [reportSelected, setReportSelected] = useState(null)
  const [fecha, setFecha] = useState('')
  const [bicicletero, setBicicletero] = useState('')
  const [descripcion, setDescripcion] = useState('')


  useEffect(() => {
    // if (!emailFromRegister) {
    //   navigate("/login");
    // }
    const fetchReports = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/guards/report/getAllReports`);
        console.log(res)
        
        const formatted = res.data.data.resultQuery.map(r => ({
          ID_Informe: r.ID_Informe,
          fecha: r.Fecha,
          descripcion: r.Descripcion,
          bicicletero: r.Bicicletero,
          imagenes: r.ImagenesURL
        }));
        

        setReports(formatted);
      } catch (error) {
        console.error("Error backend:", error);
        alert("Error al cargar guardias");
      }
    };

    fetchReports();
  }, []);

  const formatDate = (fechaHora) => {
    const date = new Date(fechaHora);

    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
  };

  

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Contenido Principal */}
      <main className="p-1 max-w-7xl mx-auto space-y-6">

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
            <h2 className="text-lg font-bold text-gray-800">Sistema de Reportes</h2>
            <p className="text-gray-500 text-sm mt-1">Registre los incidentes ocurridos en su respectivo bicicletero.</p>
            
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
                  <th className="p-4 text-center">Acciones</th> 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((r) => (
                  <tr key={r.ID_Informe} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">{r.ID_Informe}</td>
                    <td className="p-4">{formatDate(r.fecha)}</td>
                    <td className="p-4">{r.bicicletero}</td>
                    <td className="p-4 truncate max-w-xs" title={r.descripcion}>{r.descripcion}</td>
                    <td className="p-4 text-center">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-xs border border-gray-200">{r.imagenes} imágenes</span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                        <button className="flex items-center gap-1 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-sm hover:bg-blue-50 font-medium" onClick={() => {
                          setIsModalOpenEdit(true);
                          setReportSelected(r)}}> 
                          <Edit size={14}/> Editar
                        </button>
                    </td>
                    <td className='p-4'>
                        <button className="flex items-center gap-1 text-white bg-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 font-medium" onClick={() => handleDelete(r.ID_Informe)}>
                            <Trash2 size={14}/> Eliminar
                        </button>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/*Editar reporte*/}
      {isModalOpenEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animation-fade-in">
              {/* Cabecera del Modal */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Actualizar incidente</h2>
                  <p className="text-sm text-gray-500">Modifique la información necesaria del incidente.</p>
                </div>
                <button onClick={() => setIsModalOpenEdit(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
      
              {/* Formulario */}
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onRegister(); }}>
                
                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea value = {descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    rows={3}
                    placeholder="Actualice la información del incidente..."
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>
      
                {/* Botones de Acción */}
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpenEdit(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button onClick={handleEditReport}
                    type="submit" 
                    className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 font-medium"
                  >
                    Confirmar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }

      {/* Renderizar el Modal condicionalmente */}
      <NewIncidentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default IncidentesPage;