import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../features/Login/LoginPage";
import RegisterPage from "../features/Login/RegisterPage";
import { HomePage } from "../features/HomePage";
import VerifyPage from "../features/Login/VerifyPage";
import OwnerPage from "../features/Owner/OwnerPage";
import GuardPages from "../features/Guard/GuardPages";
import { CentralPage } from "../features/Central/CentralPage";
import SecurityDashboard from "../features/Central/components/SecurityDashboard";
import { NotFoundPage } from "../features/NotFoundPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Rutas Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyPage />} />

      {/* <Route path='/incidentes' element={<IncidentesPage/>} /> */}
      <Route path="/central/home" element={<CentralPage />} />
      <Route path="/central/security" element={<SecurityDashboard />} />

      {/* Rutas Guardia */}
      <Route path="/guard/home" element={<GuardPages />} />

      {/* Rutas Owner */}
      <Route path="/owner/home" element={<OwnerPage />} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
