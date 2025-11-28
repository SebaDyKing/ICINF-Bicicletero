// Frontend/src/features/Guard/GuardPages.jsx
import React from 'react';
import GuardDashboard from './components/GuardDashboard';

const GuardPages = () => {
  return (
    <div className="guard-layout">
      {/* Aquí podría ir una barra lateral de navegación específica del guardia */}
      <div className="guard-content">
        <GuardDashboard />
      </div>
    </div>
  );
};

export default GuardPages;