import React, { useState, useEffect } from 'react';
import { guardService } from '../services/guard.service';
import { FaKeyboard, FaQrcode } from 'react-icons/fa'; 

const IngresoModal = ({ onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [bicicleteros, setBicicleteros] = useState([]);
  const [rutBusqueda, setRutBusqueda] = useState('');
  const [ownerData, setOwnerData] = useState(null);
  const [selectedBici, setSelectedBici] = useState('');
  const [selectedBicicletero, setSelectedBicicletero] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- NUEVA LÓGICA: Formatear RUT ---
  const formatRut = (value) => {
    // 1. Limpiamos: Solo números y K
    const cleaned = value.replace(/[^0-9kK]/g, "");
    
    // 2. Si es corto, devolvemos limpio
    if (cleaned.length < 2) return cleaned;

    // 3. Separamos cuerpo y DV
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();

    // 4. Ponemos puntos
    const bodyFormatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${bodyFormatted}-${dv}`;
  };

  const handleRutChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatRut(rawValue);
    setRutBusqueda(formatted);
  };
  // -----------------------------------

  // Cargar bicicleteros
  useEffect(() => {
    const loadBicicleteros = async () => {
      try {
        const res = await guardService.getBicicleteros();
        let lista = [];
        if (Array.isArray(res)) lista = res;
        else if (res.data && Array.isArray(res.data)) lista = res.data;
        else if (res.data?.bicicleteros && Array.isArray(res.data.bicicleteros)) lista = res.data.bicicleteros;
        else if (res.bicicleteros && Array.isArray(res.bicicleteros)) lista = res.bicicleteros;
        setBicicleteros(lista);
      } catch (err) {
        console.error("Error cargando bicicleteros", err);
      }
    };
    loadBicicleteros();
  }, []);

  // Buscar por RUT
  const handleBuscarRut = async () => {
    if (!rutBusqueda) return;
    setLoading(true);
    setError('');
    setOwnerData(null);
    setSelectedBici(''); 
    try {
      const res = await guardService.getOwnerByRut(rutBusqueda);
      const dataDueño = res.data || res;
      if (!dataDueño) setError('Usuario no encontrado.');
      else setOwnerData(dataDueño);
    } catch (err) {
      setError('Usuario no encontrado o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Enviar
  const handleSubmit = async () => {
    if (!selectedBici || !selectedBicicletero) return;
    try {
      await guardService.registrarIngreso({
        rut_owner: ownerData.rut,
        id_bicicleta: selectedBici,
        id_bicicletero: parseInt(selectedBicicletero)
      });
      alert("Ingreso registrado con éxito");
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar ingreso";
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50 backdrop-blur-sm transition-opacity">
      
      <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-slide-down">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Ingresar Nueva Bicicleta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Pestañas */}
        <div className="flex border-b bg-gray-50">
          <button 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors
              ${activeTab === 'manual' ? 'text-blue-900 border-b-2 border-blue-900 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('manual')}
          >
            <FaKeyboard /> Registro Manual
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 transition-colors
              ${activeTab === 'qr' ? 'text-blue-900 border-b-2 border-blue-900 bg-white' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('qr')}
          >
            <FaQrcode /> Escanear QR
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          
          {activeTab === 'manual' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Dueño por RUT</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ej: 21.372.842-3"
                    className="border p-2.5 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none uppercase" // Agregué uppercase visualmente
                    value={rutBusqueda}
                    onChange={handleRutChange} // <--- CAMBIO AQUÍ: Usamos la función nueva
                    onKeyDown={(e) => e.key === 'Enter' && handleBuscarRut()}
                    maxLength={12} // <--- CAMBIO AQUÍ: Limitar largo
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

              {/* Resultados */}
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
                      {ownerData.bicycles?.map(bici => (
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

          {activeTab === 'qr' && (
            <div className="py-10 text-center text-gray-500 animate-fade-in">
              <FaQrcode className="text-6xl mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Escáner QR Próximamente</p>
              <p className="text-sm">Esta funcionalidad estará disponible en futuras actualizaciones.</p>
            </div>
          )}

        </div>

        {/* Footer */}
        {activeTab === 'manual' && (
          <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!ownerData || !selectedBici || !selectedBicicletero}
              className={`px-5 py-2.5 rounded-lg text-white font-bold transition shadow-sm
                ${(!ownerData || !selectedBici || !selectedBicicletero) 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'}`}
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