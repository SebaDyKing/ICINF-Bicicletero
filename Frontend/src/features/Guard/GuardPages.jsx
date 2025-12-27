import React from 'react';
import GuardDashboard from './components/GuardDashboard';
import GuardHeader from './components/GuardHeader';
import GuardFooter from './components/GuardFooter';

const GuardPages = () => {
  return (
    <div className="guard-layout flex flex-col min-h-screen bg-gray-100">
      <GuardHeader />
      <div className="guard-content flex-1 overflow-y-auto">
        <GuardDashboard />
      </div>
      <GuardFooter />
    </div>
  );
};

export default GuardPages;