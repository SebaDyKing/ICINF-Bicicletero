import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InfoMain from '../components/InfoMain';
import LoginPage from '../features/Login/LoginPage';
import RegisterPage from '../features/Login/RegisterPage';
import { HomePage } from '../features/HomePage';
import VerifyPage from '../features/Login/VerifyPage';
import IncidentesPage from '../components/Incidentes';
import OwnerPage from '../features/Owner/OwnerPage'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} /> 
            
            {/* Rutas Login */} 
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/verify' element={<VerifyPage />} />
              
            {/* Rutas Informes */} 
            <Route path='/infomain' element={<InfoMain />} /> 
            <Route path='/incidentes' element={<IncidentesPage/>} /> 
           

            {/* Rutas Owner */} 
            <Route path='/owner/home' element={<OwnerPage/>} /> 
            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
      );
};

export default AppRoutes;