import React from "react"
import AppRoutes from "./routes/main.routes.jsx"
import {BrowserRouter} from 'react-router-dom'
import Header from "./components/header.jsx"
import {BusquedaIncidente } from './components/BusquedaIncidente'
import HeroCarousel from './components/HeroCarousel'
import {CardBicycleRack} from './components/CardBicycleRack'
import InfoMain from "./components/InfoMain.jsx"

function App() {
  return (
    <>
    <div>
      <Header />
      <HeroCarousel />
      <InfoMain />
      <BusquedaIncidente />
    </div>
    </>
  )
}

export default App;

