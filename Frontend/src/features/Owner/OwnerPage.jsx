import SideBar from "./components/SideBar";
import Dashboard from "./components/Dashboard";
import Bikes from "./components/Bikes";
import Profile from "./components/Profile";
import { useState } from "react";

const OwnerPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "bikes" && <Bikes />}
        {activeTab === "profile" && <Profile />}
      </main>
    </div>
  );
};

export default OwnerPage;
