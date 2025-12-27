import React, { useState, useEffect, useRef } from 'react';
import { guardService } from '../services/guard.service';
import { FaKeyboard, FaQrcode } from 'react-icons/fa'; 
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode'; 
import Swal from 'sweetalert2'; 

/**
 * Componente IngresoModal
 * -----------------------
 * Modal interactivo que permite al guardia registrar el ingreso de una bicicleta.
 * Soporta dos modos de operación:
 * 1. MANUAL: Búsqueda por RUT del usuario.
 * 2. QR: Escaneo directo mediante la cámara del dispositivo.
 * * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onSuccess - Callback para recargar la tabla tras un registro exitoso.
 */
const IngresoModal = ({ onClose, onSuccess }) => {
  // --- CONTROL DE PESTAÑAS (TABS) ---
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'qr'
  const [bicicleteros, setBicicleteros] = useState([]); // Lista de ubicaciones disponibles
  
  // --- ESTADOS PARA FLUJO MANUAL ---
  const [rutBusqueda, setRutBusqueda] = useState('');
  const [ownerData, setOwnerData] = useState(null);       // Datos del usuario encontrado
  const [selectedBici, setSelectedBici] = useState('');   // ID de la bicicleta seleccionada
  const [selectedBicicletero, setSelectedBicicletero] = useState('');
  
  // --- ESTADOS PARA FLUJO QR ---
  const [scanResult, setScanResult] = useState(null);     // Datos decodificados del QR
  const [selectedBicicleteroQR, setSelectedBicicleteroQR] = useState('');
  const [cameraActive, setCameraActive] = useState(true); // Controla si la cámara está encendida
  const scannerRef = useRef(null);                        // Referencia mutable para la instancia del escáner

  // --- ESTADOS DE UI GENERALES ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Formatea el RUT en tiempo real (agrega puntos y guión).
   * @param {string} value - RUT sin formato.
   */
  const formatRut = (value) => {
    const cleaned = value.replace(/[^0-9kK]/g, "");
    if (cleaned.length < 2) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();
    return `${body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${dv}`;
  };

  const handleRutChange = (e) => {
    setRutBusqueda(formatRut(e.target.value));
  };

  // Carga inicial de la lista de bicicleteros (Racks)
  useEffect(() => {
    const loadBicicleteros = async () => {
      try {
        const res = await guardService.getBicicleteros();
        const lista = res?.data?.bicicleteros || res?.data || res || [];
        if (Array.isArray(lista)) {
            setBicicleteros(lista);
            // Pre-selecciona el primer bicicletero para agilizar el flujo QR
            if (lista.length > 0) setSelectedBicicleteroQR(lista[0].id_bicicletero);
        }
      } catch (err) { console.error("Error cargando bicicleteros", err); }
    };
    loadBicicleteros();
  }, []);

  /**
   * ================= LÓGICA DEL ESCÁNER (QR) =================
   * Este efecto gestiona el ciclo de vida de la cámara.
   * Se activa solo cuando la pestaña es 'qr' y la cámara está activa.
   */
  useEffect(() => {
    let scanner = null;
    
    // Función de limpieza para detener la cámara correctamente
    const cleanupScanner = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING || 
                    scannerRef.current.getState() === Html5QrcodeScannerState.PAUSED) {
                    await scannerRef.current.clear();
                }
            } catch (err) { console.warn("Limpieza de scanner:", err); }
            scannerRef.current = null;
        }
    };

    if (activeTab === 'qr' && !scanResult && cameraActive) {
      // Retraso intencional para asegurar que el DOM ('qr-reader') esté listo
      const timer = setTimeout(async () => {
        await cleanupScanner();
        try {
            // Inicialización de la librería html5-qrcode
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0, rememberLastUsedCamera: true },
                false
            );
            scannerRef.current = scanner;
            
            // Callback de éxito al leer un código
            scanner.render(
                (decodedText) => {
                    try {
                        const data = JSON.parse(decodedText);
                        // Validación básica del formato del QR
                        if (data.rut && (data.idBicicleta || data.id_bicicleta)) {
                            setScanResult(data);
                            cleanupScanner(); // Detenemos cámara al encontrar un QR válido
                            setError('');
                        } else { 
                            // Feedback visual si el QR no es del sistema
                            Swal.fire({
                                icon: 'error',
                                title: 'QR Inválido',
                                text: 'Este código no pertenece al sistema de bicicletas.',
                                confirmButtonColor: '#d33',
                            });
                        }
                    } catch (err) { console.error("Error parseando QR", err); }
                },
                (errorMessage) => { /* Ignoramos errores de lectura cuadro a cuadro */ }
            );
        } catch (err) { setError("No se pudo iniciar la cámara."); }
      }, 500);
      
      // Cleanup al desmontar o cambiar dependencias
      return () => { clearTimeout(timer); cleanupScanner(); };
    } else { cleanupScanner(); }
  }, [activeTab, scanResult, cameraActive]);

  const handleReiniciarScanner = () => {
    setScanResult(null);
    setCameraActive(true); 
    setError('');
  };

  /**
   * Busca al dueño en la base de datos usando el RUT ingresado.
   * Si existe, carga sus bicicletas en el selector.
   */
  const handleBuscarRut = async () => {
    if (!rutBusqueda) return;
    setLoading(true);
    setError('');
    setOwnerData(null);
    setSelectedBici(''); 
    
    try {
      const res = await guardService.getOwnerWithBicycles(rutBusqueda);
      const dataDueño = res?.data?.data || res?.data || res;

      if (!dataDueño || !dataDueño.rut) {
          setError('Usuario no encontrado.');
      } else {
          setOwnerData(dataDueño);
          const bicis = dataDueño.bicycles || dataDueño.bicicletas || [];
          if (bicis.length > 0) setSelectedBici(bicis[0].id_bicicleta);
      }
    } catch (err) {
      console.error(err);
      setError('Usuario no encontrado o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Envía el formulario de ingreso MANUAL al backend.
   */
  const handleSubmitManual = async () => {
    if (!selectedBici || !selectedBicicletero) return;
    try {
      await guardService.registrarIngreso({
        rut_owner: ownerData.rut,
        id_bicicleta: selectedBici,
        id_bicicletero: parseInt(selectedBicicletero)
      });
      
      // Feedback de Éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Ingreso Registrado!',
        text: 'La bicicleta ha sido ingresada correctamente.',
        confirmButtonColor: '#16a34a',
        confirmButtonText: 'Aceptar'
      });

      onSuccess();
      onClose();
    } catch (err) {
      const resData = err.response?.data;
      const mensajeError = resData?.errorDetails || resData?.message || "Error al registrar ingreso";
      
      // Feedback de Error
      Swal.fire({
        icon: 'error',
        title: 'Error al Ingresar',
        text: mensajeError,
        confirmButtonColor: '#d33',
      });
    }
  };

  /**
   * Envía el formulario de ingreso vía QR al backend.
   */
  const handleSubmitQR = async () => {
    if (!scanResult || !selectedBicicleteroQR) return;
    setLoading(true);
    try {
        const idBici = scanResult.idBicicleta || scanResult.id_bicicleta;
        await guardService.registrarIngreso({
            rut_owner: scanResult.rut,
            id_bicicleta: idBici,
            id_bicicletero: parseInt(selectedBicicleteroQR)
        });

        await Swal.fire({
            icon: 'success',
            title: '¡Ingreso por QR Exitoso!',
            text: 'La bicicleta ha sido ingresada correctamente.',
            confirmButtonColor: '#16a34a',
            confirmButtonText: 'Aceptar'
        });

        onSuccess();
        onClose();
    } catch (err) {
        const resData = err.response?.data;
        const mensajeError = resData?.errorDetails || resData?.message || "Error al registrar ingreso QR";
        
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensajeError,
            confirmButtonColor: '#d33',
        });
    } finally { setLoading(false); }
  };

  if (!activeTab) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-slide-down">
        
        {/* Encabezado del Modal */}
        <div className="bg-[#003366] px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Ingresar Nueva Bicicleta</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl leading-none">&times;</button>
        </div>

        {/* Navegación (Tabs) */}
        <div className="flex border-b bg-gray-50">
          <button 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors
              ${activeTab === 'manual' ? 'text-blue-900 border-b-2 border-blue-900 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setActiveTab('manual'); setCameraActive(false); }} 
          >
            <FaKeyboard /> Registro Manual
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors
              ${activeTab === 'qr' ? 'text-blue-900 border-b-2 border-blue-900 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setActiveTab('qr'); setCameraActive(true); }} 
          >
            <FaQrcode /> Escanear QR
          </button>
        </div>

        <div className="p-6">
          {/* === CONTENIDO PESTAÑA MANUAL === */}
          {activeTab === 'manual' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Dueño por RUT</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej: 21.372.842-3"
                    className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                    value={rutBusqueda}
                    onChange={handleRutChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarRut()}
                    maxLength={12}
                  />
                  <button 
                    onClick={handleBuscarRut}
                    disabled={loading || !rutBusqueda}
                    className="bg-blue-900 text-white px-5 rounded-lg font-medium hover:bg-blue-800 disabled:bg-gray-300 transition"
                  >
                    {loading ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

              {/* Resultado de búsqueda manual */}
              {ownerData && (
                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 space-y-4 animate-fade-in-up">
                  <div className="border-b border-blue-200 pb-3">
                    <p className="text-blue-900 font-bold text-lg">{ownerData.nombre} {ownerData.apellido}</p>
                    <p className="text-gray-600 text-sm">{ownerData.rut}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Bicicleta</label>
                    <select 
                      className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                      value={selectedBici}
                      onChange={(e) => setSelectedBici(e.target.value)}
                    >
                      <option value="">-- Seleccione --</option>
                      {(ownerData.bicycles || ownerData.bicicletas || []).map(bici => (
                        <option key={bici.id_bicicleta} value={bici.id_bicicleta}>
                          {bici.modelo} ({bici.color})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación de Ingreso</label>
                    <select 
                      className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                      value={selectedBicicletero}
                      onChange={(e) => setSelectedBicicletero(e.target.value)}
                    >
                      <option value="">-- Seleccione --</option>
                      {bicicleteros.map(rack => (
                        <option key={rack.id_bicicletero} value={rack.id_bicicletero}>
                          {rack.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === CONTENIDO PESTAÑA QR === */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center animate-fade-in">
                {!scanResult ? (
                    <div className="w-full">
                        {cameraActive ? (
                            <>
                                <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative min-h-62.5 flex items-center justify-center mb-2">
                                    <div id="qr-reader" className="w-full h-full"></div>
                                </div>
                                <button onClick={() => setCameraActive(false)} className="w-full py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-sm mb-3">Detener Escáner</button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 w-full min-h-62.5 gap-6">
                                <h3 className="text-gray-600 font-medium text-xl">El escáner está detenido</h3>
                                <button onClick={() => setCameraActive(true)} className="px-8 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-lg flex items-center gap-2"><FaQrcode /> Iniciar Escáner</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full space-y-4 animate-fade-in-up">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <h3 className="font-bold text-green-800 text-lg">¡Lectura Exitosa!</h3>
                            <p className="text-green-700 font-medium mt-1">{scanResult.nombre || 'Usuario detectado'}</p>
                            <p className="font-mono text-sm text-gray-600">{scanResult.rut}</p>
                            {scanResult.modelo && (<div className="mt-3 inline-block bg-white px-3 py-1 rounded border border-green-200 text-xs text-gray-500 font-bold">🚲 {scanResult.modelo}</div>)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Guardar en:</label>
                            <select className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500" value={selectedBicicleteroQR} onChange={(e) => setSelectedBicicleteroQR(e.target.value)}>
                                {bicicleteros.map(rack => (<option key={rack.id_bicicletero} value={rack.id_bicicletero}>{rack.nombre}</option>))}
                            </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={handleReiniciarScanner} className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition">Cancelar</button>
                            <button onClick={handleSubmitQR} disabled={loading} className="flex-1 py-3 bg-blue-900 text-white rounded-lg font-bold hover:bg-blue-800 transition shadow-sm">{loading ? 'Guardando...' : 'Confirmar Ingreso'}</button>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded w-full">{error}</p>}
            </div>
          )}
        </div>

        {/* Footer del Modal (Botones para pestaña Manual) */}
        {activeTab === 'manual' && (
          <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition">Cancelar</button>
            <button 
              onClick={handleSubmitManual}
              disabled={!ownerData || !selectedBici || !selectedBicicletero}
              className={`px-5 py-2.5 rounded-lg text-white font-bold transition shadow-sm ${(!ownerData || !selectedBici || !selectedBicicletero) ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              Registrar Ingreso
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default IngresoModal;