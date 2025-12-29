import React, { useState, useEffect } from 'react';
import { guardService } from '../services/guard.service';
import IngresoModal from './IngresoModal';
import { Search, Bike, Minus, Plus } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Componente BicicletasTab
 * ------------------------
 * Tablero principal para el Guardia.
 * CORRECCIÓN HORA FINAL: Se usan métodos UTC puros.
 * Esto evita que el navegador reste las 3 horas de Chile a una fecha
 * que el servidor ya podría estar enviando ajustada.
 */
function BicicletasTab() {
  // --- ESTADOS ---
  const [registros, setRegistros] = useState([]); // Lista cruda de bicicletas activas
  const [loading, setLoading] = useState(true);   // Estado de carga inicial
  const [error, setError] = useState('');         // Manejo de errores de red
  const [showModal, setShowModal] = useState(false); // Visibilidad del modal de ingreso
  const [busqueda, setBusqueda] = useState('');   // Término de búsqueda
  const [stats, setStats] = useState({ ingresosHoy: 0, retirosHoy: 0 }); // Contadores

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Obtiene los registros activos y estadísticas desde el backend.
   */
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resActivos = await guardService.getRegistrosActivos();
      const resStats = await guardService.getEstadisticas();

      // Normalización: Asegura que siempre trabajemos con arrays/objetos válidos
      const dataActivos = resActivos?.data || resActivos || [];
      const dataStats = resStats?.data || resStats || { ingresosHoy: 0, retirosHoy: 0 };

      setRegistros(dataActivos);
      setStats(dataStats);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el proceso completo de retiro de una bicicleta.
   */
  const handleRetirar = async (idBicicleta) => {
    // 1. Confirmación con UI personalizada
    const result = await Swal.fire({
      title: '¿Confirmar retiro?',
      text: "La bicicleta quedará registrada como 'Salida'.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', 
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, retirar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    // 2. Proceso de Retiro API
    try {
      await guardService.registrarRetiro(idBicicleta);
      
      // 3. Feedback de Éxito
      await Swal.fire({
        title: '¡Retirada!',
        text: 'La bicicleta ha sido retirada exitosamente.',
        icon: 'success',
        confirmButtonColor: '#16a34a' // Verde
      });

      // Recargar datos para actualizar la lista
      cargarDatos(); 
    } catch (err) {
      // 4. Manejo de Error
      const msg = err.response?.data?.message || 'No se pudo registrar el retiro.';
      Swal.fire({
        title: 'Error',
        text: msg,
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  // Callback para refrescar la tabla cuando se crea un ingreso desde el Modal
  const handleIngresoSuccess = () => {
    cargarDatos();
    setShowModal(false);
  };

  /**
   * Utilidad para limpiar textos.
   */
  const normalizeText = (text) => {
    if (!text) return "";
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // --- HELPER PARA CORREGIR LA HORA (MODO UTC "RAW") ---
  // Extrae los números tal cual vienen del servidor sin aplicar zona horaria.
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: '-', time: '-' };
    const date = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, '0');
    
    return {
        // Usamos getUTC... para leer el dato exacto de la base de datos
        // ignorando si el navegador está en Chile, China o Marte.
        date: `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`,
        time: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`
    };
  };

  // --- LÓGICA DE FILTRADO ---
  const registrosFiltrados = registros.filter((reg) => {
    if (!reg?.bicycle?.owner) return false;

    const term = normalizeText(busqueda); 
    const rut = normalizeText(reg.bicycle.owner.rut);
    const nombre = normalizeText(reg.bicycle.owner.nombre);
    const apellido = normalizeText(reg.bicycle.owner.apellido);
    const idBici = normalizeText(reg.bicycle.id_bicicleta);
    const nombreCompleto = `${nombre} ${apellido}`;

    return (
      rut.includes(term) ||
      nombre.includes(term) ||
      apellido.includes(term) ||
      nombreCompleto.includes(term) || 
      idBici.includes(term)
    );
  });

  // --- LÓGICA DE AGRUPACIÓN ---
  const registrosAgrupados = registrosFiltrados.reduce((acc, curr) => {
    const nombreRack = curr.bicycleRack?.nombre || 'Sin Ubicación';
    if (!acc[nombreRack]) acc[nombreRack] = [];
    acc[nombreRack].push(curr);
    return acc;
  }, {});

  if (loading) return <div className="p-10 text-center text-gray-500">Cargando información...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-bold bg-red-50 rounded-lg mx-4 mt-4">{error}</div>;

  return (
    <div className="animate-fade-in pb-20">
      
      {/* 1. SECCIÓN DE ESTADÍSTICAS */}
      <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-8">
        <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div className="flex flex-col justify-between h-full">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium leading-tight">Bicis Activas</p>
            <p className="text-xl md:text-4xl font-normal text-gray-800 mt-1 md:mt-2">{registros.length}</p>
          </div>
          <Bike className="text-gray-300 w-5 h-5 md:w-6 md:h-6 shrink-0" />
        </div>

        <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div className="flex flex-col justify-between h-full">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium leading-tight">Retiradas Hoy</p>
            <p className="text-xl md:text-4xl font-normal text-gray-800 mt-1 md:mt-2">{stats.retirosHoy}</p>
          </div>
          <Minus className="text-gray-300 w-5 h-5 md:w-6 md:h-6 shrink-0" />
        </div>

        <div className="bg-white p-2 md:p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
          <div className="flex flex-col justify-between h-full">
            <p className="text-gray-500 text-[10px] md:text-sm font-medium leading-tight">Ingresos Hoy</p>
            <p className="text-xl md:text-4xl font-normal text-gray-800 mt-1 md:mt-2">{stats.ingresosHoy}</p>
          </div>
          <Plus className="text-gray-300 w-5 h-5 md:w-6 md:h-6 shrink-0" />
        </div>
      </div>

      {/* 2. BARRA DE HERRAMIENTAS */}
      <div className="mb-6">
        <div className="mb-2">
          <h2 className="font-bold text-gray-800 text-lg">Bicicletas Registradas</h2>
          <p className="text-xs text-gray-500">Gestione el ingreso y retiro de bicicletas</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar por nombre, RUT o ID..." 
              className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#003366] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-900 transition flex items-center gap-2 whitespace-nowrap shadow-sm"
          >
            + Ingresar Bicicleta
          </button>
        </div>
      </div>

      {/* 3. LISTADO DE REGISTROS */}
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

            {/* --- VISTA DE ESCRITORIO --- */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left table-fixed">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold w-[15%]">ID Bicicleta</th>
                    <th className="px-6 py-3 font-semibold w-[15%]">RUT</th>
                    <th className="px-6 py-3 font-semibold w-[20%]">Nombre</th>
                    <th className="px-6 py-3 font-semibold w-[20%]">Bicicleta</th> 
                    <th className="px-6 py-3 font-semibold w-[20%]">Fecha/Hora</th>
                    <th className="px-6 py-3 font-semibold w-[10%] text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {listaBicis.map((reg) => {
                    const { date, time } = formatDateTime(reg.fechaIngreso);

                    return (
                    <tr key={reg.id_registro || reg.idRegistro || Math.random()} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 truncate">{reg.bicycle.id_bicicleta}</td>
                      <td className="px-6 py-4 text-gray-600 truncate">{reg.bicycle.owner.rut}</td>
                      <td className="px-6 py-4 text-gray-600 truncate">{reg.bicycle.owner.nombre} {reg.bicycle.owner.apellido}</td>
                      
                      <td className="px-6 py-4 text-gray-600 truncate">
                          {reg.bicycle.marca ? `${reg.bicycle.marca} ` : ''} 
                          {reg.bicycle.modelo} 
                          <span className="text-gray-400 text-xs ml-1">({reg.bicycle.color})</span>
                      </td>

                      <td className="px-6 py-4 text-gray-600 truncate">
                        {date} <span className="text-gray-300 mx-1">|</span> {time}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                            onClick={() => handleRetirar(reg.bicycle.id_bicicleta)} 
                            className="text-gray-600 border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-white hover:text-red-600 hover:border-red-500 hover:shadow-sm transition"
                        >
                            — Retirar
                        </button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>

            {/* --- VISTA MÓVIL --- */}
            <div className="md:hidden flex flex-col gap-4 p-4 bg-gray-50">
              {listaBicis.map((reg) => {
                const { date, time } = formatDateTime(reg.fechaIngreso);

                return (
                <div key={reg.id_registro || reg.idRegistro || Math.random()} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 font-sans">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[#003366] font-bold text-lg">
                      {reg.bicycle.id_bicicleta}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {date}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 text-sm text-gray-800">
                    <div>
                      <span className="text-gray-500">Nombre: </span>
                      <span className="font-bold ml-1">{reg.bicycle.owner.nombre} {reg.bicycle.owner.apellido}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">RUT: </span>
                      <span className="font-bold ml-1">{reg.bicycle.owner.rut}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Bicicleta: </span>
                      <span className="font-bold ml-1">
                          {reg.bicycle.marca ? `${reg.bicycle.marca} ` : ''} 
                          {reg.bicycle.modelo} - {reg.bicycle.color}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Hora ingreso: </span>
                      <span className="font-bold ml-1">{time}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRetirar(reg.bicycle.id_bicicleta)} 
                    className="w-full bg-[#003366] hover:bg-blue-900 text-white font-bold py-3 rounded-xl flex items-center justify-center transition shadow-sm"
                  >
                    <Minus className="text-white mr-2" size={18} strokeWidth={3} />
                    Retirar Bicicleta
                  </button>
                </div>
              )})}
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