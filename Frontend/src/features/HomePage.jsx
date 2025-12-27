import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Smartphone, ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';

/**
 * Componente HomePage (Landing Page)
 * ----------------------------------
 * Versión actualizada: Opción C (Carrusel / Slider Automático).
 * Muestra las imágenes en un slider interactivo que avanza solo.
 */
export const HomePage = () => {
  // --- ESTADOS DEL COMPONENTE ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- ESTADOS DEL CARRUSEL ---
  const [currentSlide, setCurrentSlide] = useState(0);

  // --- DATOS DE LA GALERÍA ---
  const galleryImages = [
    { src: "/landing/bici-face-1.jpg", alt: "Vista interior Bicicletero FACE", location: "Sector FACE" },
    { src: "/landing/bici-idiomas-1.jpg", alt: "Acceso controlado Idiomas", location: "Sector Idiomas" },
    { src: "/landing/bici-face-2.jpg", alt: "Interior techado y seguro", location: "Sector FACE" },
    { src: "/landing/bici-idiomas-2.jpg", alt: "Bicicletero de alta densidad", location: "Sector Idiomas" },
    { src: "/landing/bici-face-3.jpg", alt: "Con sistema de vigilancia", location: "Sector FACE" },
    { src: "/landing/bici-idiomas-3.jpg", alt: "Entorno Bicicletero Idiomas", location: "Sector Idiomas" },
  ];

  // --- LÓGICA DEL CARRUSEL ---
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Efecto para Auto-Play (Cambia cada 5 segundos)
  useEffect(() => {
    const slideInterval = setInterval(nextSlide, 5000);
    return () => clearInterval(slideInterval); // Limpieza al desmontar o cambiar slide
  }, [currentSlide]); // Dependencia para reiniciar el timer si el usuario cambia manualmente

  // --- EFECTO DE SCROLL NAVBAR ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* ================================================================
        1. NAVBAR (BARRA DE NAVEGACIÓN)
        ================================================================ */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#003366] shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* --- LOGOTIPO --- */}
          <div className="flex items-center gap-3">
            <img 
              src="/LogoUBB2.png" 
              alt="Logo UBB" 
              className={`h-10 md:h-12 w-auto rounded px-2 transition-all duration-300 ${isScrolled ? '' : 'bg-white/10 backdrop-blur-sm'}`} 
            />
            <div className={`leading-tight ${isScrolled ? 'text-white' : 'text-white drop-shadow-md'}`}>
              <h1 className="font-bold text-lg md:text-xl tracking-wide">BICICLETEROS</h1>
              <p className="text-[10px] md:text-xs font-light uppercase tracking-wider">Universidad del Bío-Bío</p>
            </div>
          </div>

          {/* --- MENÚ ESCRITORIO --- */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className="text-white hover:text-blue-200 transition text-sm font-medium">Beneficios</a>
            <a href="#ubicaciones" className="text-white hover:text-blue-200 transition text-sm font-medium">Espacios</a>
            
            <div className="h-6 w-px bg-white/30 ml-2 mr-2"></div>

            <Link 
              to="/login" 
              className="bg-white text-[#003366] px-6 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center"
            >
              Ingresar
            </Link>
          </div>

          {/* --- BOTÓN HAMBURGUESA --- */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#003366]/95 backdrop-blur-md border-t border-blue-800 shadow-xl py-4 px-6 flex flex-col gap-4 animate-fade-in-down">
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-blue-800/50">Beneficios</a>
            <a href="#ubicaciones" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-blue-800/50 mb-2">Espacios</a>
            <Link to="/login" className="bg-white text-[#003366] text-center py-3 rounded-xl font-bold shadow-md">
              Ingresar
            </Link>
          </div>
        )}
      </nav>

      {/* ================================================================
        2. HERO SECTION (PORTADA)
        ================================================================ */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
            <img 
                src="/landing/hero-bg.jpg" 
                alt="Estudiantes UBB en bicicleta" 
                className="w-full h-full object-cover"
                onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop'}} 
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#003366]/90 via-[#003366]/70 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6 animate-slide-right">
            <div className="inline-block bg-blue-500/20 border border-blue-400/30 backdrop-blur-md px-4 py-1 rounded-full text-sm font-semibold text-blue-100">
              🚀 Nuevo Sistema de Gestión
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Tu bicicleta segura <br/>
              <span className="text-blue-300">dentro del campus</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-lg font-light leading-relaxed">
              Gestiona tu acceso, revisa disponibilidad en tiempo real y mantén tu transporte protegido con el respaldo oficial de la UBB.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/login" className="bg-white text-[#003366] px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition shadow-xl flex items-center justify-center gap-2">
                Comenzar ahora <ChevronRight size={20} />
              </Link>
              <a href="#ubicaciones" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition flex items-center justify-center">
                Ver Galería
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
        3. SECCIÓN DE BENEFICIOS
        ================================================================ */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mb-4">Seguridad y Tecnología</h2>
            <p className="text-gray-600">Hemos modernizado nuestros bicicleteros para brindarte la tranquilidad que necesitas mientras estudias.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-gray-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Shield className="text-[#003366] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Protección Integral</h3>
              <p className="text-gray-600 leading-relaxed">
                Control de acceso restringido solo a estudiantes y funcionarios autorizados. Vigilancia presencial y monitoreo constante.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-gray-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Smartphone className="text-[#003366] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ingreso Digital QR</h3>
              <p className="text-gray-600 leading-relaxed">
                Olvídate de los trámites en papel. Genera tu código QR único desde tu celular y accede en segundos.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-gray-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Clock className="text-[#003366] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Disponibilidad Real</h3>
              <p className="text-gray-600 leading-relaxed">
                Revisa cuántos espacios quedan disponibles en cada sector antes de llegar a la universidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
        4. SECCIÓN DE UBICACIONES (CARRUSEL / SLIDER)
        ================================================================ 
        Implementación de slider automático con controles manuales.
      */}
      <section id="ubicaciones" className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          
          {/* Cabecera */}
          <div className="text-center mb-10">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-xs md:text-sm bg-blue-100 px-3 py-1 rounded-full">
              Infraestructura
            </span>
            <h2 className="text-[#003366] text-3xl md:text-5xl font-bold mt-4 mb-4">Conoce nuestros espacios</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Recorre virtualmente nuestras instalaciones diseñadas para tu seguridad.
            </p>
          </div>

          {/* CONTENEDOR DEL SLIDER */}
          <div className="max-w-5xl mx-auto relative group">
            
            {/* Marco de Imagen */}
            <div className="relative h-100 md:h-125 w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                {/* Contenedor deslizante */}
                <div 
                    className="flex transition-transform duration-700 ease-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {galleryImages.map((img, index) => (
                        <div key={index} className="min-w-full h-full relative">
                            <img 
                                src={img.src} 
                                alt={img.alt} 
                                className="w-full h-full object-cover"
                                onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1505705694340-019e1e335916?q=80&w=1632&auto=format&fit=crop'}}
                            />
                            {/* Overlay informativo sobre la imagen */}
                            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-[#003366] via-[#003366]/60 to-transparent p-8 pt-20">
                                <h3 className="text-white text-2xl font-bold">{img.location}</h3>
                                <p className="text-blue-100 mt-1">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Flecha Izquierda (Anterior) */}
            <button 
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronLeft size={32} />
            </button>

            {/* Flecha Derecha (Siguiente) */}
            <button 
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
            >
                <ChevronRight size={32} />
            </button>

            {/* Puntos Indicadores (Dots) */}
            <div className="flex justify-center gap-2 mt-6">
                {galleryImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                            currentSlide === index 
                                ? 'bg-[#003366] w-8 h-2' 
                                : 'bg-gray-300 w-2 h-2 hover:bg-blue-400'
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                    />
                ))}
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================
        5. FOOTER (PIE DE PÁGINA)
        ================================================================ */}
      <footer className="bg-[#003366] text-white py-12 border-t border-blue-800">
        <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <img src="/LogoUBB2.png" alt="UBB" className="h-12 opacity-80" />
                    <div className="text-sm text-gray-300">
                        <p>© 2025 Universidad del Bío-Bío.</p>
                        <p>Todos los derechos reservados.</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <span className="text-gray-300 text-xs">Sistema de Gestión de Bicicletas</span>
                </div>
            </div>
        </div>
      </footer>

    </div>
  );
};