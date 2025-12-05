import { useState } from "react";
import { Bike, User, QrCode, ChevronLeft, ChevronRight, LogOut, SquareMenu, Zap  } from "lucide-react";

const SideBar = ({activeTab, setActiveTab}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  //const [isLoggedIn, setIsLoggedIn] = useState(true); 
  
  const handleLogout = () => {
    //setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  return (
    <div>
      {/* SIDEBAR (Navegación Lateral) */}
      <aside
        className={`fixed md:sticky top-0 h-screen bg-[#1e3a8a] text-white p-2 flex flex-col justify-between transition-all duration-250 ease-in-out z-50 
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        ${isSidebarCollapsed ? "w-30" : "w-60"}`}
      >
        {/* Botón de Colapsar (Solo visible en escritorio) */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-10 bg-white text-[#1e3a8a] p-1 rounded-full shadow-md border border-slate-200 hidden md:flex items-center justify-center hover:bg-blue-50 transition-colors z-50"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>

        <div className="flex flex-col h-full">
          {/* Logo y título */}
          <div
            className={`flex items-center gap-3 mb-10 transition-all duration-300 ${
              isSidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <img className="h-15 ml-3 mt-1" src="/LogoUBB2.png" alt="LogoUBB" />
            <span
              className={`text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300 ${
                isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              Bicicleteros UBB
            </span>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-2 flex-1">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
              title={isSidebarCollapsed ? "Panel Principal" : ""}
            >
              <QrCode size={20} />
              <span
                className={`transition-all duration-300 ${
                  isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Panel Principal
              </span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab("bikes");
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "bikes"
                  ? "bg-blue-700 text-white" //Estilos cuando esta activo
                  : "text-blue-200 hover:bg-blue-800" //Estilos cuando NO esta activo
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
              title={isSidebarCollapsed ? "Mis Bicicletas" : ""}
            >
              <Bike size={20} />
              <span
                className={`transition-all duration-300 ${
                  isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Mis Bicicletas
              </span>
            </button>
            
            <button
              onClick={() => {
                setActiveTab("profile");
                setIsMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-blue-700 text-white"
                  : "text-blue-200 hover:bg-blue-800"
              } ${isSidebarCollapsed ? "justify-center" : ""}`}
              title={isSidebarCollapsed ? "Mi Perfil" : ""}
            >
              <User size={20} />
              <span
                className={`transition-all duration-300 ${
                  isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Mi Perfil
              </span>
            </button>
          </nav>

          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 py-3 rounded-lg text-blue-200 hover:bg-blue-800 hover:text-white transition-colors overflow-hidden whitespace-nowrap mt-4
            ${isSidebarCollapsed ? "justify-center px-2" : "px-4"}
          `}
            title={isSidebarCollapsed ? "Cerrar Sesión" : ""}
          >
            <Zap size={20} className="shrink-0" />
            
            <span
              className={`transition-all duration-300 ${
                isSidebarCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              Cerrar Sesión
            </span>
          </button>
        </div>
      </aside>

      {/* OVERLAY para móvil */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Botón para abrir menú en móvil */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed top-4 left-4 bg-[#1e3a8a] text-white p-2 rounded-md md:hidden z-30"
      >
        <SquareMenu />
      </button>
    </div>
  );
};

export default SideBar;