import React from 'react';
import { Header } from './components/Header'; 
import { DashboardStats } from './components/DashboardStats';
import { Bar } from 'recharts';
import { BarchartCentral } from './components/BarchartCentral';

export const CentralPage = () => {

  return (
    
    <div className="min-h-screen bg-gray-100"> 
      <Header/>
    
      <main className="max-w-7xl mx-auto mt-6 mb-10 px-4 sm:px-6 lg:px-8">
        <DashboardStats/>
      </main>
      
    </div>
  );
};