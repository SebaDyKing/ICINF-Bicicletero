import Header from "../components/header";
import { BusquedaIncidente } from "../components/BusquedaIncidente";
import HeroCarousel from "../components/HeroCarousel";
import InfoMain from "../components/InfoMain";
import CardBicycleRack from '../components/CardBicycleRack';
import FooterHome from "../components/FooterHome";

export const HomePage = () => {
  return (
    <div>
      <Header />
      <HeroCarousel />
      <CardBicycleRack />
      <InfoMain />
      <BusquedaIncidente />
      <FooterHome />
    </div>
  );
};
