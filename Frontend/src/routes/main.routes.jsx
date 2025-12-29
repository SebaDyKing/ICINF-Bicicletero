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
import { ProtectedRoute } from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Rutas Login */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyPage />} />

      {/* Rutas protegidas para Central */}
      <Route
        path="/central/home"
        element={
          <ProtectedRoute allowedRoles={['Central']}>
            <CentralPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/central/security"
        element={
          <ProtectedRoute allowedRoles={['Central']}>
            <SecurityDashboard />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para Guardia */}
      <Route
        path="/guard/home"
        element={
          <ProtectedRoute allowedRoles={['Guard']}>
            <GuardPages />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas para Owner */}
      <Route
        path="/owner/home"
        element={
          <ProtectedRoute allowedRoles={['Owner']}>
            <OwnerPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
