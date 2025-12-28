import React, { useState, useEffect } from 'react';
import HeaderOwner from '../components/HeaderOwner';
import QRCode from 'qrcode'; 
import { 
  Bike, 
  ChevronDown, 
  Download, 
  RefreshCw, 
  MapPin, 
  SquareParking, 
  History,       
  CheckCircle2,  
  XCircle        
} from 'lucide-react';

import { 
    getBicyclesByRut, 
    getOwnerHistory, 
    getBicicleterosStatus 
} from '../services/owner.service';

/**
 * @component Dashboard
 * @description Panel principal del Dueño. Muestra sus bicicletas, genera el código QR
 * para el acceso, visualiza la disponibilidad de bicicleteros y el historial reciente.
 */
const Dashboard = ({ user }) => {
  // --- ESTADOS ---
  const [misBicicletas, setMisBicicletas] = useState([]);
  const [historial, setHistorial] = useState([]);       
  const [bicisAdentro, setBicisAdentro] = useState([]); 
  const [bicicleteros, setBicicleteros] = useState([]);

  const [loadingGlobal, setLoadingGlobal] = useState(true);
  const [selectedBike, setSelectedBike] = useState(null);
  const [qrImage, setQrImage] = useState('');
  const [loadingQr, setLoadingQr] = useState(false);
  
  // Estado para la fecha y hora en vivo
  const [fechaActual, setFechaActual] = useState(new Date());

  // RELOJ EN VIVO
  useEffect(() => {
    const timer = setInterval(() => {
      setFechaActual(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // CARGA DE DATOS
  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.rut) return;

      try {
        setLoadingGlobal(true);

        // 1. CARGAR BICICLETAS
        try {
            const response = await getBicyclesByRut(user.rut);
            
            // Lógica unificada para encontrar el array de datos
            const rawBicis = response?.data?.data || response?.data || response?.bicycles || response?.bicicletas || response || [];
            const listaBicis = Array.isArray(rawBicis) ? rawBicis : [];

            setMisBicicletas(listaBicis);
            
            // Seleccionar la primera bici por defecto
            if (listaBicis.length > 0) setSelectedBike(listaBicis[0]);
        } catch (err) { 
            console.error("Error cargando bicicletas:", err); 
            setMisBicicletas([]); 
        }

        // 2. CARGAR HISTORIAL Y DETECTAR BICIS ACTIVAS
        try {
            const historyResponse = await getOwnerHistory(user.rut);
            
            const rawHistory = historyResponse?.data?.data || historyResponse?.data || historyResponse || [];
            const listaHistorial = Array.isArray(rawHistory) ? rawHistory : [];
            
            setHistorial(listaHistorial);

            // Filtramos solo los ingresos que NO tienen fecha de salida
            const activas = listaHistorial.filter(h => h.tipo === 'Ingreso' && !h.fecha_salida);
            setBicisAdentro(activas);

        } catch (err) { console.error("Error historial:", err); }

        // 3. DISPONIBILIDAD DE BICICLETEROS
        try {
            const statusResponse = await getBicicleterosStatus();
            
            const rawStatus = statusResponse?.data || statusResponse || [];
            const listaStatus = Array.isArray(rawStatus) ? rawStatus : [];
            
            setBicicleteros(listaStatus);
        } catch (err) { console.error("Error disponibilidad:", err); }

      } finally {
        setLoadingGlobal(false);
      }
    };

    fetchAllData();
  }, [user]);

  // GENERAR QR AL CAMBIAR DE BICICLETA
  useEffect(() => {
    if (selectedBike) handleGenerarQR(selectedBike);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBike]);

  /**
   * @function handleGenerarQR
   * @description Genera un código QR en base64 con los datos del usuario y la bicicleta seleccionada.
   */
  const handleGenerarQR = async (bike) => {
    setLoadingQr(true);
    try {
      const dataParaQR = {
        rut: user.rut,
        nombre: `${user.nombre} ${user.apellido}`,
        idBicicleta: bike.id_bicicleta, 
        marca: bike.marca, // AGREGADO: Marca en el QR
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

  const formatDateShort = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <HeaderOwner user={user} />

      <div className="px-4 md:px-10 py-6 animate-fade-in max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
           <h2 className="text-xl font-bold text-slate-800">Panel Principal</h2>
           <button onClick={() => window.location.reload()} className="text-slate-400 hover:text-blue-600 transition" title="Actualizar datos">
             <RefreshCw size={20} />
           </button>
        </div>

        {loadingGlobal && misBicicletas.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
             <RefreshCw className="animate-spin text-blue-900" size={32} />
             <p>Cargando información...</p>
           </div>
        ) : misBicicletas.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Bike size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-700">Aún no tienes bicicletas</h3>
            <p className="text-slate-500 mt-2 mb-6">Regístralas en "Mis Bicicletas" para comenzar.</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* GRID SUPERIOR */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. TARJETA QR (PASE DIGITAL) */}
                <div className="lg:col-span-2 w-full bg-[#1e3a8a] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start transition-all hover:shadow-2xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col gap-4 items-center relative z-10 shrink-0">
                        <div className="bg-white p-3 rounded-2xl shadow-lg w-64 h-64 flex items-center justify-center relative">
                            {loadingQr ? <RefreshCw className="animate-spin text-gray-400" /> : 
                             qrImage ? <img src={qrImage} alt="QR Acceso" className="w-full h-full object-contain rounded-lg" /> : 
                             <span className="text-xs text-red-400">Error al generar QR</span>}
                        </div>
                        <button onClick={handleDescargarQR} className="flex items-center gap-2 text-sm font-medium text-blue-200 hover:text-white transition py-2 px-4 hover:bg-blue-800/50 rounded-lg">
                            <Download size={16} /> Guardar Imagen
                        </button>
                    </div>

                    <div className="flex-1 w-full z-10 flex flex-col justify-center h-full py-2">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit border border-green-500/30">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> SISTEMA ACTIVO
                        </div>
                        
                        <h2 className="text-3xl font-bold mb-1">Pase de Acceso</h2>
                        
                        <div className="text-blue-300 font-mono text-sm mb-4">
                          {fechaActual.toLocaleDateString()} <span className="mx-1">|</span> {fechaActual.toLocaleTimeString()}
                        </div>

                        <p className="text-blue-100 text-sm mb-6 opacity-90">Escanea este código con un guardia al ingresar o salir.</p>
                        
                        <div className="bg-blue-900/50 p-1.5 rounded-xl border border-blue-500/30 backdrop-blur-sm w-full max-w-md relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                    <Bike className="text-blue-200" size={20} />
                                </div>
                                <select 
                                    className="w-full bg-transparent text-white pl-12 pr-10 py-3 rounded-lg appearance-none focus:outline-none focus:bg-blue-900/80 cursor-pointer font-bold text-base border-none"
                                    value={selectedBike?.id_bicicleta || ''}
                                    onChange={(e) => setSelectedBike(misBicicletas.find(b => b.id_bicicleta.toString() === e.target.value))}
                                >
                                    {misBicicletas.map(b => (
                                        // CAMBIO VISUAL: Agregada la Marca en el selector
                                        <option key={b.id_bicicleta} value={b.id_bicicleta} className="bg-[#0f172a] text-white">
                                            {b.marca} {b.modelo} ({b.color})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 pointer-events-none" size={20} />
                        </div>
                          <p className="text-blue-300 text-xs mt-2 ml-2">
                            ID: <span className="font-mono text-white font-bold">{selectedBike?.id_bicicleta}</span>
                        </p>
                    </div>
                </div>

                {/* COLUMNA DERECHA: WIDGETS */}
                <div className="space-y-6">
                    
                    {/* --- WIDGET ESTADO ACTUAL --- */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 h-fit">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <MapPin size={14} /> Estado Actual
                        </h3>

                        {bicisAdentro.length > 1 ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                                    <span className="bg-indigo-50 p-2 rounded-lg"><Bike size={20} /></span>
                                    <p className="font-bold text-lg">{bicisAdentro.length} Bicicletas en Campus</p>
                                </div>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                    {bicisAdentro.map((ingreso, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                                            <div>
                                                {/* CAMBIO VISUAL: Agregada Marca */}
                                                <p className="font-bold text-slate-700">
                                                    {ingreso.marca} {ingreso.modelo_bicicleta}
                                                </p>
                                                <p className="text-xs text-slate-500">{ingreso.nombre_bicicletero}</p>
                                            </div>
                                            <span className="text-xs font-mono bg-white px-2 py-1 rounded border text-slate-400">
                                                {formatDateShort(ingreso.fecha)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : bicisAdentro.length === 1 ? (
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-green-50 text-green-600">
                                    <Bike size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">En Campus</p>
                                    <p className="text-sm text-slate-600 font-medium">{bicisAdentro[0].nombre_bicicletero}</p>
                                    {/* CAMBIO VISUAL: Agregada Marca */}
                                    <p className="text-xs text-slate-400 mt-1">
                                        {bicisAdentro[0].marca} {bicisAdentro[0].modelo_bicicleta} • {formatDateShort(bicisAdentro[0].fecha)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-2xl bg-slate-50 text-slate-400">
                                    <Bike size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">Fuera de Campus</p>
                                    <p className="text-sm text-slate-500">Sin registro de ingreso activo.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- WIDGET DISPONIBILIDAD --- */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 h-fit">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <SquareParking size={14} /> Disponibilidad UBB
                        </h3>
                        <div className="space-y-4">
                            {bicicleteros.length > 0 ? bicicleteros.map((rack) => (
                                <div key={rack.id_bicicletero} className="grid grid-cols-12 gap-4 items-center text-sm">
                                    
                                    <span className="col-span-6 text-slate-600 font-medium truncate" title={rack.nombre}>
                                        {rack.nombre}
                                    </span>

                                    <div className="col-span-6 flex items-center gap-3 justify-end">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
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
                                <p className="text-xs text-slate-400 text-center py-2">Cargando disponibilidad...</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* HISTORIAL */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <History className="text-slate-400" size={18} /> Actividad Reciente
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Acción</th>
                                <th className="px-4 py-3">Ubicación</th>
                                <th className="px-4 py-3">Bicicleta</th>
                                <th className="px-4 py-3 rounded-r-lg">Fecha / Hora</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {historial.length > 0 ? historial.slice(0, 5).map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
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
                                    <td className="px-4 py-3 text-slate-600">{log.nombre_bicicletero || '-'}</td>
                                    
                                    {/* CAMBIO VISUAL: Agregada Marca */}
                                    <td className="px-4 py-3 text-slate-600 font-medium">
                                        {log.marca ? `${log.marca} ${log.modelo_bicicleta}` : log.modelo_bicicleta || '-'}
                                    </td>
                                    
                                    <td className="px-4 py-3 text-slate-400 font-mono whitespace-nowrap">
                                        {formatDateShort(log.fecha)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-slate-400">Sin movimientos registrados.</td>
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