import React from "react";
import Header from "../components/header";
import { BusquedaIncidente } from "../components/BusquedaIncidente";
import HeroCarousel from "../components/HeroCarousel";
import InfoMain from "../components/InfoMain";
// import { CardBicycleRack } from '../components/CardBicycleRack';

export const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <InfoMain />
      <BusquedaIncidente />
    </div>
  );
};
