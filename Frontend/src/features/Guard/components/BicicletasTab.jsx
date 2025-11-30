import React, { useState, useEffect } from 'react';
import { guardService } from '../services/guard.service';
import IngresoModal from './IngresoModal';
import { Search, Bike, Minus, Plus } from 'lucide-react';

function BicicletasTab() {
  const [registros, setRegistros] = useState([]);
  const [capacidades, setCapacidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [stats, setStats] = useState({ ingresosHoy: 0, retirosHoy: 0 });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resActivos = await guardService.getRegistrosActivos();
      const resCapacidades = await guardService.getCapacidades();
      const resStats = await guardService.getEstadisticas();

      setRegistros(resActivos.data || resActivos);
      setCapacidades(resCapacidades.data || resCapacidades);
      setStats(resStats.data || resStats);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetirar = async (idBicicleta) => {
    if (!window.confirm('¿Confirmar retiro de esta bicicleta?')) return;
    try {
      await guardService.registrarRetiro(idBicicleta);
      alert('Bicicleta retirada exitosamente');
      cargarDatos(); 
    } catch (err) {
      alert('Error al retirar bicicleta');
    }
  };

  const handleIngresoSuccess = () => {
    cargarDatos();
    setShowModal(false);
  };

  const registrosFiltrados = registros.filter((reg) => {
    const term = busqueda.toLowerCase();
    return (
      reg.bicycle.owner.rut.toLowerCase().includes(term) ||
      reg.bicycle.owner.nombre.toLowerCase().includes(term) ||
      reg.bicycle.owner.apellido.toLowerCase().includes(term) ||
      reg.bicycle.id_bicicleta.toLowerCase().includes(term)
    );
  });

  const registrosAgrupados = registrosFiltrados.reduce((acc, curr) => {
    const nombreRack = curr.bicycleRack.nombre;
    if (!acc[nombreRack]) acc[nombreRack] = [];
    acc[nombreRack].push(curr);
    return acc;
  }, {});

  if (loading) return <div className="p-10 text-center">Cargando bicicletas...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="animate-fade-in">
      {/* Tarjetas Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Bicicletas Activas</p>
            <p className="text-4xl font-normal text-gray-800 mt-2">{registros.length}</p>
          </div>
          <Bike className="text-gray-300" size={24} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium">Retiradas Hoy</p>
            <p className="text-4xl font-normal text-gray-800 mt-2">{stats.retirosHoy}</p>
          </div>
          <Minus className="text-gray-300" size={24} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm font-medium">Ingresos Hoy</p>
            <p className="text-4xl font-normal text-gray-800 mt-2">{stats.ingresosHoy}</p>
          </div>
          <Plus className="text-gray-300" size={24} />
        </div>
      </div>

      {/* Barra Herramientas */}
      <div className="mb-6">
        <div className="mb-2">
          <h2 className="font-bold text-gray-800 text-lg">Bicicletas Registradas</h2>
          <p className="text-xs text-gray-500">Gestione el ingreso y retiro de bicicletas</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-2/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nombre, RUT o ID de bicicleta..." 
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#003366] text-white px-6 py-2 rounded text-sm font-bold hover:bg-blue-900 transition flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            + Ingresar Bicicleta
          </button>
        </div>
      </div>

      {/* Tablas */}
      {Object.keys(registrosAgrupados).length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center text-gray-500 border border-gray-200">
          {busqueda ? 'No se encontraron resultados.' : 'No hay bicicletas activas.'}
        </div>
      ) : (
        Object.entries(registrosAgrupados).map(([nombreBicicletero, listaBicis]) => (
          <div key={nombreBicicletero} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="bg-[#003366] px-6 py-3 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm uppercase tracking-wide">{nombreBicicletero}</h3>
              <span className="bg-white text-[#003366] text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{listaBicis.length} bicicletas</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left table-fixed">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold w-[15%]">ID Bicicleta</th>
                    <th className="px-6 py-3 font-semibold w-[15%]">RUT</th>
                    <th className="px-6 py-3 font-semibold w-[20%]">Nombre</th>
                    <th className="px-6 py-3 font-semibold w-[20%]">Tipo/Color</th>
                    <th className="px-6 py-3 font-semibold w-[20%]">Fecha/Hora</th>
                    <th className="px-6 py-3 font-semibold w-[10%] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listaBicis.map((reg) => (
                    <tr key={reg.idRegistro} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 truncate">{reg.bicycle.id_bicicleta}</td>
                      <td className="px-6 py-4 text-gray-600 truncate">{reg.bicycle.owner.rut}</td>
                      <td className="px-6 py-4 text-gray-600 truncate">{reg.bicycle.owner.nombre} {reg.bicycle.owner.apellido}</td>
                      <td className="px-6 py-4 text-gray-600 truncate">{reg.bicycle.modelo} ({reg.bicycle.color})</td>
                      <td className="px-6 py-4 text-gray-600 truncate">
                        {new Date(reg.fechaIngreso).toLocaleDateString()} <span className="text-gray-300 mx-1">|</span> {new Date(reg.fechaIngreso).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleRetirar(reg.bicycle.id_bicicleta)} className="text-gray-600 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-white hover:text-red-600 hover:border-red-500 hover:shadow-sm transition">— Retirar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {showModal && (
        <IngresoModal 
          onClose={() => setShowModal(false)} 
          onSuccess={handleIngresoSuccess} 
        />
      )}
    </div>
  );
}

export default BicicletasTab;