import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Bikes from "./components/Bikes";
import Profile from "./components/Profile";
import { useState } from "react";
import { useUserData } from "./hooks/useUserData.js";

const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const rut = "21.260.782-7";
  const user = useUserData(rut);

  // Mientras carga, evita acceder a propiedades nulas
  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard user={user} />}
        {activeTab === "bikes" && <Bikes user={user} />}
        {activeTab === "profile" && <Profile user={user} />}
      </main>
    </div>
  );
};

export default OwnerPage;
