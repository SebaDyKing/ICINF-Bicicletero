import React, { useState } from 'react';
import BicicletasTab from './BicicletasTab';
import Incidentes from './Incidentes'

function GuardDashboard() {
  const [activeTab, setActiveTab] = useState('bicicletas'); // 'bicicletas' o 'incidentes'

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      
      {/* Barra de Navegación (Solo 2 pestañas ahora) */}
      <div className="bg-white shadow-sm mb-6">
        <div className="container mx-auto px-6 flex">
          
          <button 
            onClick={() => setActiveTab('bicicletas')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'bicicletas' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Gestión de Bicicletas
          </button>

          <button 
            onClick={() => setActiveTab('incidentes')}
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
              activeTab === 'incidentes' 
                ? 'border-blue-900 text-blue-900' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Informes de Incidentes
          </button>

        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Renderizado Condicional Limpio */}
        {activeTab === 'bicicletas' && <BicicletasTab />}
        {activeTab === 'incidentes' && <Incidentes />}
      </div>

    </div>
  );
}

export default GuardDashboard;