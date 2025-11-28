// Frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom"; // Importamos las herramientas de ruta

// --- Componentes Comunes ---
import Header from "./components/header";

// --- Componentes de tu Amigo (Landing Page) ---
import HeroCarousel from './components/HeroCarousel';
import InfoMain from "./components/InfoMain"; 
import { BusquedaIncidente } from './components/BusquedaIncidente';
// import { CardBicycleRack } from './components/CardBicycleRack'; // Estaba comentado

// --- Tus Componentes (Guardia) ---
import GuardPages from './features/Guard/GuardPages';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* El Header aparece en TODAS las páginas */}
      <Header />

      <main className="flex-grow">
        <Routes>
          
          {/* RUTA 1: INICIO (Lo de tu amigo) */}
          <Route path="/" element={
            <>
              <HeroCarousel />
              <InfoMain />
              <BusquedaIncidente />
            </>
          } />

          {/* RUTA 2: PANEL DE GUARDIA (Tu trabajo) */}
          <Route path="/guardia" element={<GuardPages />} />

        </Routes>
      </main>

      {/* Aquí podrías poner el Footer si lo decides usar */}
    </div>
  );
}

export default App;