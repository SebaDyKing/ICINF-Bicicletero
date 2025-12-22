import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Bikes from "./components/Bikes";
import Profile from "./components/Profile";
import RequestGuard from './components/RequestGuard.jsx'
import { useState } from "react";
import { useUserData } from "./hooks/useUserData.js";
import { useAuth } from "../../Context/useAuth.js";
import { Navigate } from "react-router-dom";

const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useAuth();
  const userData = useUserData(user?.rut);

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

  if (!userData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando perfil...
      </div>
    );
  }

  return (
    <div className="flex">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard user={userData} />}
        {activeTab === "bikes" && <Bikes user={userData} />}
        {activeTab === "request-guard" && <RequestGuard user={userData} />}
        {activeTab === "profile" && <Profile user={userData} />}
      </main>
    </div>
  );
};

export default OwnerPage;
