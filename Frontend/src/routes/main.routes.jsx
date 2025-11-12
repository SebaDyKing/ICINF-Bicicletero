import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InfoMain from '../components/InfoMain';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/infomain' element={<InfoMain />} /> 
        </Routes>
    )
}

export default AppRoutes;
