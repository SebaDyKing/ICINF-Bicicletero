// Frontend/src/features/Guard/GuardPages.jsx
import React from 'react';
import GuardDashboard from './components/GuardDashboard';
import GuardHeader from './components/GuardHeader';

const GuardPages = () => {
  return (
    <div className="guard-layout">
      <GuardHeader />
      <div className="guard-content">
        <GuardDashboard />
      </div>
    </div>
  );
};

export default GuardPages;