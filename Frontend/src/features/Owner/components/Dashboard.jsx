import React, { useState, useEffect } from 'react';
import HeaderOwner from '../components/HeaderOwner';
import QRCode from 'qrcode'; 
import { 
  Bike, ChevronDown, Download, RefreshCw, 
  MapPin, SquareParking, History, CheckCircle2, XCircle 
} from 'lucide-react';

import { 
    getBicyclesByRut, 
    getOwnerHistory, 
    getBicicleterosStatus 
} from '../services/owner.service';

/**
 * @component Dashboard
 * @description Panel principal del Dueño. 
 * CORRECCIÓN HORA: Se usa 'es-CL' para convertir automáticamente 
 * la hora UTC del servidor a la hora local de Chile.
 */
const Dashboard = ({ user }) => {
  // ==========================================
  // ESTADOS
  // ==========================================
  
  // --- Datos del Negocio ---
  const [misBicicletas, setMisBicicletas] = useState([]); 
  const [historial, setHistorial] = useState([]);         
  const [bicisAdentro, setBicisAdentro] = useState([]);   
  const [bicicleteros, setBicicleteros] = useState([]);   

  // --- UI y Control ---
  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [selectedBike, setSelectedBike] = useState(null); 
  const [qrImage, setQrImage] = useState('');             
  const [loadingQr, setLoadingQr] = useState(false);
  const [fechaActual, setFechaActual] = useState(new Date());

  // ==========================================
  // EFECTOS (Lógica)
  // ==========================================

  // 1. Reloj en vivo (Independiente del servidor, siempre hora local correcta)
  useEffect(() => {
    const timer = setInterval(() => setFechaActual(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Carga inicial de datos
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.rut) return;

      try {
        setLoadingGlobal(true);

        // A. Obtener Bicicletas
        try {
            const response = await getBicyclesByRut(user.rut);
            const rawBicis = response?.data?.data || response?.data || response?.bicycles || response?.bicicletas || response || [];
            const listaBicis = Array.isArray(rawBicis) ? rawBicis : [];
            setMisBicicletas(listaBicis);
            
            if (listaBicis.length > 0) setSelectedBike(listaBicis[0]);
        } catch (err) { 
            console.error("Error cargando bicicletas:", err); 
            setMisBicicletas([]); 
        }

        // B. Cargar Historial y Filtrar Activos
        try {
            const historyResponse = await getOwnerHistory(user.rut);
            const rawHistory = historyResponse?.data?.data || historyResponse?.data || historyResponse || [];
            const listaHistorial = Array.isArray(rawHistory) ? rawHistory : [];
            setHistorial(listaHistorial);
            
            const activas = listaHistorial.filter(h => h.tipo === 'Ingreso' && !h.fecha_salida);
            setBicisAdentro(activas);
        } catch (err) { console.error("Error historial:", err); }

        // C. Cargar Disponibilidad
        try {
            const statusResponse = await getBicicleterosStatus();
            const rawStatus = statusResponse?.data || statusResponse || [];
            setBicicleteros(Array.isArray(rawStatus) ? rawStatus : []);
        } catch (err) { console.error("Error disponibilidad:", err); }

      } finally {
        setLoadingGlobal(false);
      }
    };

    fetchAllData();
  }, [user]);

  // 3. Regenerar QR automáticamente
  useEffect(() => {
    if (selectedBike) handleGenerarQR(selectedBike);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBike]);

  // ==========================================
  // FUNCIONES
  // ==========================================

  const handleGenerarQR = async (bike) => {
    setLoadingQr(true);
    try {
      // El QR lleva la hora de generación local (new Date().getTime()), así que siempre estará bien.
      const dataParaQR = {
        rut: user.rut,
        nombre: `${user.nombre} ${user.apellido}`,
        idBicicleta: bike.id_bicicleta, 
        marca: bike.marca,
        modelo: bike.modelo,
        color: bike.color,
        generado_a: new Date().getTime()
      };
      
      const url = await QRCode.toDataURL(JSON.stringify(dataParaQR), {
        width: 400, margin: 1, color: { dark: '#003366', light: '#ffffff' }
      });
      setQrImage(url);
    } catch (err) { 
        console.error("Error generando QR:", err); 
    } finally { 
        setLoadingQr(false); 
    }
  };

  const handleDescargarQR = () => {
    if (!qrImage || !selectedBike) return;
    const link = document.createElement('a');
    link.href = qrImage;
    link.download = `Pase-${selectedBike.modelo}.png`;
    document.body.appendChild(link); 
    link.click(); 
    document.body.removeChild(link);
  };

  const getBarColor = (ocupados, total) => {
      const porcentaje = total > 0 ? (ocupados / total) * 100 : 0;
      if (porcentaje >= 100) return 'bg-red-500';    
      if (porcentaje >= 50) return 'bg-yellow-400';  
      return 'bg-green-400';                         
  };

  // --- HELPER PARA CORREGIR LA HORA (FIX FINAL) ---
  // Transforma la hora UTC del servidor a la hora local (Chile)
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    
    // 'es-CL' convierte automáticamente la hora UTC (06:00) a hora Chile (03:00)
    const fecha = date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
    const hora = date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    return `${fecha} ${hora}`;
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50">
      
      <HeaderOwner user={user} />

      <div className="max-w-6xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
        
        {/* TITULO */}
        <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-gray-900">Panel Principal</h2>
           <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-blue-600 transition" title="Actualizar datos">
             <RefreshCw size={20} />
           </button>
        </div>

        {/* LOADING & EMPTY STATES */}
        {loadingGlobal && misBicicletas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <RefreshCw className="animate-spin text-blue-900" size={32} />
              <p>Cargando información...</p>
            </div>
        ) : misBicicletas.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow-sm text-center border border-gray-100">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Bike size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-700">Aún no tienes bicicletas</h3>
            <p className="text-gray-500 mt-2 mb-6">Regístralas en "Mis Bicicletas" para comenzar.</p>
          </div>
        ) : (
          /* GRID PRINCIPAL */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. SECCIÓN QR (Izq: Ocupa 2 cols en PC) */}
            <div className="lg:col-span-2 flex">
                <div className="w-full bg-[#1e3a8a] rounded-xl p-6 md:p-8 text-white shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-center justify-between transition-all h-full">
                    
                    {/* Decoración Fondo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

                    {/* QR Image */}
                    <div className="flex flex-col gap-4 items-center relative z-10 shrink-0">
                        <div className="bg-white p-3 rounded-xl shadow-lg w-56 h-56 flex items-center justify-center relative">
                            {loadingQr ? <RefreshCw className="animate-spin text-gray-400" /> : 
                            qrImage ? (
                                <img src={qrImage} alt="QR Acceso" className="w-full h-full object-contain rounded-lg max-w-full" /> 
                            ) : 
                            <span className="text-xs text-red-400">Error</span>}
                        </div>
                        <button onClick={handleDescargarQR} className="flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white transition py-2 px-4 hover:bg-blue-800/50 rounded-lg">
                            <Download size={16} /> Guardar Imagen
                        </button>
                    </div>

                    {/* Info & Select */}
                    <div className="flex-1 w-full z-10 flex flex-col justify-center py-2 h-full">
                        <div className="flex flex-col h-full justify-center">
                            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit border border-green-500/30">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> SISTEMA ACTIVO
                            </div>
                            
                            <h2 className="text-2xl font-bold mb-1">Pase de Acceso</h2>
                            
                            <div className="text-blue-300 font-mono text-sm mb-4">
                            {/* ESTA HORA ES DEL CLIENTE (PC/CELULAR), NO SE TOCA */}
                            {fechaActual.toLocaleDateString()} <span className="mx-1">|</span> {fechaActual.toLocaleTimeString()}
                            </div>

                            <p className="text-blue-100 text-sm mb-6 opacity-90">Escanea este código con un guardia al ingresar al recinto.</p>
                            
                            <div className="bg-blue-900/50 p-1.5 rounded-lg border border-blue-500/30 backdrop-blur-sm w-full relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <Bike className="text-blue-200" size={20} />
                                    </div>
                                    <select 
                                        className="w-full bg-transparent text-white pl-12 pr-10 py-3 rounded-lg appearance-none focus:outline-none focus:bg-blue-900/80 cursor-pointer font-bold text-sm border-none"
                                        value={selectedBike?.id_bicicleta || ''}
                                        onChange={(e) => setSelectedBike(misBicicletas.find(b => b.id_bicicleta.toString() === e.target.value))}
                                    >
                                        {misBicicletas.map(b => (
                                            <option key={b.id_bicicleta} value={b.id_bicicleta} className="bg-[#0f172a] text-white">
                                                {b.marca} {b.modelo} ({b.color})
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 pointer-events-none" size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. WIDGETS (Der: Ocupa 1 col en PC) */}
            <div className="lg:col-span-1 space-y-6">
                
                {/* WIDGET: Estado Actual */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Estado Actual
                    </h3>

                    {bicisAdentro.length > 1 ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                <span className="bg-indigo-50 p-2 rounded-lg"><Bike size={20} /></span>
                                <p className="font-bold text-lg">{bicisAdentro.length} en Campus</p>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {bicisAdentro.map((ingreso, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-bold text-gray-700">
                                                {ingreso.marca} {ingreso.modelo_bicicleta}
                                            </p>
                                            <p className="text-xs text-gray-500">{ingreso.nombre_bicicletero}</p>
                                        </div>
                                        <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-gray-400">
                                            {formatDateTime(ingreso.fecha)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : bicisAdentro.length === 1 ? (
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-green-50 text-green-600">
                                <Bike size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-lg">En Campus</p>
                                <p className="text-sm text-gray-600 font-medium">{bicisAdentro[0].nombre_bicicletero}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {bicisAdentro[0].marca} {bicisAdentro[0].modelo_bicicleta} • {formatDateTime(bicisAdentro[0].fecha)}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-gray-50 text-gray-400">
                                <Bike size={24} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-lg">Fuera de Campus</p>
                                <p className="text-sm text-gray-500">Sin registro de ingreso activo.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* WIDGET: Disponibilidad */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                        <SquareParking size={14} /> Disponibilidad UBB
                    </h3>
                    <div className="space-y-4">
                        {bicicleteros.length > 0 ? bicicleteros.map((rack) => (
                            <div key={rack.id_bicicletero} className="grid grid-cols-12 gap-4 items-center text-sm">
                                
                                <span className="col-span-6 text-gray-600 font-medium truncate" title={rack.nombre}>
                                    {rack.nombre}
                                </span>

                                <div className="col-span-6 flex items-center gap-3 justify-end">
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-500 ${getBarColor(rack.occupied, rack.total)}`} 
                                            style={{ width: `${Math.min((rack.occupied / rack.total) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-bold w-12 text-right ${rack.status === 'Lleno' ? 'text-red-500' : 'text-green-600'}`}>
                                        {rack.occupied}/{rack.total}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-xs text-gray-400 text-center py-2">Cargando disponibilidad...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. HISTORIAL (Abajo del todo, ocupando 3 cols en PC) */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <History className="text-gray-400" size={18} /> Actividad Reciente
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg whitespace-nowrap">Acción</th>
                                <th className="px-4 py-3 whitespace-nowrap">Ubicación</th>
                                <th className="px-4 py-3 whitespace-nowrap">Bicicleta</th>
                                <th className="px-4 py-3 rounded-r-lg whitespace-nowrap">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {historial.length > 0 ? historial.slice(0, 5).map((log, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        {log.tipo === 'Ingreso' ? (
                                            <span className="flex items-center gap-2 text-green-600">
                                                <CheckCircle2 size={16} /> Entrada
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-orange-500">
                                                <XCircle size={16} /> Salida
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{log.nombre_bicicletero || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600 font-medium whitespace-nowrap">
                                        {log.marca ? `${log.marca} ${log.modelo_bicicleta}` : log.modelo_bicicleta || '-'}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-gray-400 font-mono whitespace-nowrap">
                                        {formatDateTime(log.fecha)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-gray-400">Sin movimientos registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;