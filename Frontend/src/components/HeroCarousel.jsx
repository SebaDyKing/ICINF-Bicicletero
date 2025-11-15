// Frontend/src/components/HeroCarousel.jsx
import React from 'react';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Importa el CSS de la librería

function HeroCarousel() {
  return (
    // 'relative' nos permite poner texto "encima" de la imagen
    <div className="relative">
      
      <Carousel
        showThumbs={false}   // Oculta las miniaturas de abajo
        showStatus={false}   // Oculta el "1 of 3"
        infiniteLoop={true}  // Hace que el carrusel sea infinito
        autoPlay={true}      // Se mueve solo
        interval={5000}      // Cambia cada 5 segundos
        className="w-full"
      >
        
        {/* --- SLIDE 1 --- */}
        <div>
          <img 
            src="https://via.placeholder.com/1400x600/333333/808080?text=Imagen+Carrusel+1" 
            alt="Bicicletas estacionadas" 
            className="w-full h-[500px] object-cover" // h-[500px] le da una altura fija
          />
        </div>

        {/* --- SLIDE 2 --- */}
        <div>
          <img 
            src="https://via.placeholder.com/1400x600/444444/808080?text=Imagen+Carrusel+2" 
            alt="Bicicletero UBB" 
            className="w-full h-[500px] object-cover"
          />
        </div>

        {/* --- SLIDE 3 --- */}
        <div>
          <img 
            src="https://via.placeholder.com/1400x600/555555/808080?text=Imagen+Carrusel+3" 
            alt="Estudiante con bicicleta" 
            className="w-full h-[500px] object-cover"
          />
        </div>

      </Carousel>

      {/* --- TEXTO Y BOTÓN SUPERPUESTOS --- */}
      {/* Estas clases 'absolute' lo ponen "encima" del carrusel */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-40">
        
        <h1 className="text-5xl font-bold text-center">
          Espacios seguros para tu bicicleta
        </h1>
        
        <p className="text-xl mt-4">
          Monitoreo constante y protección
        </p>

      </div>
    </div>
  );
}

export default HeroCarousel;