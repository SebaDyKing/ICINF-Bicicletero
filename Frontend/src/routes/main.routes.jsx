import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InfoMain from '../components/InfoMain';
import IncidentesPage from '../components/Incidentes';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/infomain' element={<InfoMain />} /> 
            <Route path='/incidentes' element={<IncidentesPage/>} /> 
        </Routes>
    )
}

export default AppRoutes;
