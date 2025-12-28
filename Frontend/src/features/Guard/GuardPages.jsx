import React from 'react';
import GuardDashboard from './components/GuardDashboard';
import GuardHeader from './components/GuardHeader';
import GuardFooter from './components/GuardFooter';

/**
 * @component GuardPages
 * @description Componente de diseño (Layout) principal para la vista del Guardia.
 * Estructura la página en tres secciones verticales:
 * 1. Header (Superior)
 * 2. Dashboard/Contenido (Central y scrolleable)
 * 3. Footer (Inferior)
 * @returns {JSX.Element} El layout completo de la vista de guardia.
 */
const GuardPages = () => {
  return (
    // Contenedor principal: Ocupa toda la altura de pantalla (min-h-screen)
    <div className="guard-layout flex flex-col min-h-screen bg-gray-100">
      
      <GuardHeader />
      
      {/* Contenido Central: flex-1 permite que ocupe el espacio restante y habilita scroll interno */}
      <div className="guard-content flex-1 overflow-y-auto">
        <GuardDashboard />
      </div>

      <GuardFooter />
      
    </div>
  );
};

export default GuardPages;