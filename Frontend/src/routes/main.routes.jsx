import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultRoute from '../components/DefaultRoute';
import InfoMain from '../components/InfoMain';
const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<DefaultRoute />} /> 
            <Route path='/infomain' element={<InfoMain />} /> 
        </Routes>
    )
}

export default AppRoutes;
