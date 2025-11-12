import React from "react"
import AppRoutes from "./routes/main.routes.jsx"
import {BrowserRouter} from 'react-router-dom'
import {BusquedaIncidente } from './components/BusquedaIncidente'
import HeroCarousel from './components/HeroCarousel'
import {CardBicycleRack} from './components/CardBicycleRack'

function App() {
  return (
    <>
    <div> 
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <HeroCarousel />
      <BusquedaIncidente />
    </div>
    </>
  )
}

export default App;

