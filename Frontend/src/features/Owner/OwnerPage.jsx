import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Bikes from "./components/Bikes";
import Profile from "./components/Profile";
import RequestGuard from "./components/RequestGuard.jsx";
import { useState } from "react";
import { useUserData } from "./hooks/useUserData.js";
import { useBikeData } from "./hooks/useBikeData.js";
import { useAuth } from "../../Context/useAuth.js";
import { Navigate } from "react-router-dom";

/**
 * @component OwnerPage
 * @brief Página principal (Layout) para el rol de Dueño.
 *
 * Este componente actúa como el controlador principal de la vista del usuario.
 * Sus responsabilidades son:
 * 1. Gestionar la navegación lateral (Sidebar) y el cambio de vistas.
 * 2. Centralizar la obtención de datos (Fetching): Trae la información del usuario
 * y sus bicicletas en este nivel superior para evitar múltiples llamadas en componentes hijos.
 * 3. Gestionar los estados de carga globales antes de mostrar la interfaz.
 */
const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const userData = useUserData(user?.rut);

  const { bikes, setBikes } = useBikeData(user?.rut);

  // Espera a que Firebase/Auth determine si hay sesión activa
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando contexto...
      </div>
    );
  }

  // Cerrar sesión
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Espera a que el hook useUserData traiga la info de la BD
  // Esto evita renderizar componentes con datos de usuario 'undefined'
  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando perfil...
      </div>
    );
  }

  // Unificación de datos: Combina la info de Auth (email, metadatos) con la de la BD (nombre, rut, rol)
  // para pasar un objeto 'user' completo a los hijos.
  const currentUser = { ...userData, ...user };

  return (
    <div className="flex">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {/* Renderizado Condicional según la pestaña activa */}
        {activeTab === "dashboard" && <Dashboard user={currentUser} />}
        {activeTab === "bikes" && (
          <Bikes user={currentUser} bike={bikes} setBikes={setBikes} />
        )}
        {activeTab === "request-guard" && <RequestGuard user={currentUser} />}
        {activeTab === "profile" && <Profile user={currentUser} />}
      </main>
    </div>
  );
};

export default OwnerPage;
