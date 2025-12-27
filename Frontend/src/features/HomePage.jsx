import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, Smartphone, MapPin, ChevronRight, Menu, X, Info } from 'lucide-react';

/**
 * Componente HomePage (Landing Page)
 * ----------------------------------
 * Página principal pública del sistema. Muestra información institucional,
 * beneficios del sistema y ubicaciones de los bicicleteros.
 * * Características:
 * - Navbar transparente que se vuelve sólido al hacer scroll.
 * - Diseño totalmente responsivo (Mobile-first con Tailwind CSS).
 * - Manejo de imágenes con fallback (si falla la carga, muestra una por defecto).
 */
export const HomePage = () => {
  // --- ESTADOS DEL COMPONENTE ---
  
  // Estado para detectar si el usuario ha hecho scroll hacia abajo
  // Se usa para cambiar el fondo del Navbar de transparente a azul sólido.
  const [isScrolled, setIsScrolled] = useState(false);

  // Estado para controlar la apertura/cierre del menú hamburguesa en móviles.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // --- EFECTOS (Side Effects) ---

  /**
   * useEffect para manejar el evento de scroll.
   * Se ejecuta una sola vez al montar el componente ([]).
   */
  useEffect(() => {
    const handleScroll = () => {
      // Si el scroll vertical es mayor a 50px, cambiamos el estado a true
      setIsScrolled(window.scrollY > 50);
    };

    // Agregamos el "escuchador" del evento scroll
    window.addEventListener('scroll', handleScroll);

    // IMPORTANTE: Función de limpieza (cleanup) para remover el evento
    // cuando el componente se desmonta, evitando fugas de memoria.
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* ================================================================
        1. NAVBAR (BARRA DE NAVEGACIÓN)
        ================================================================
        Utiliza clases dinámicas: si 'isScrolled' es true, aplica fondo azul y sombra.
        Si es false, es transparente para fusionarse con el Hero.
      */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#003366] shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          
          {/* --- LOGOTIPO --- */}
          <div className="flex items-center gap-3">
            {/* Lógica visual del Logo:
              - Tiene un fondo semitransparente (bg-white/10) cuando está arriba.
              - El fondo desaparece al hacer scroll para integrarse con el navbar azul.
              - 'px-2' se mantiene fijo para evitar saltos de tamaño.
            */}
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

          {/* --- MENÚ ESCRITORIO (Hidden en Mobile) --- */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#beneficios" className="text-white hover:text-blue-200 transition text-sm font-medium">Beneficios</a>
            <a href="#ubicaciones" className="text-white hover:text-blue-200 transition text-sm font-medium">Ubicaciones</a>
            
            {/* Separador vertical decorativo */}
            <div className="h-6 w-px bg-white/30 ml-2 mr-2"></div>

            {/* Botón de Acción Principal (CTA) */}
            <Link 
              to="/login" 
              className="bg-white text-[#003366] px-6 py-2.5 rounded-full font-bold hover:bg-blue-50 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center"
            >
              Ingresar
            </Link>
          </div>

          {/* --- BOTÓN HAMBURGUESA (Solo visible en Mobile) --- */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {/* Alterna entre icono de Menú e icono de Cerrar (X) */}
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#003366]/95 backdrop-blur-md border-t border-blue-800 shadow-xl py-4 px-6 flex flex-col gap-4 animate-fade-in-down">
            <a href="#beneficios" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-blue-800/50">Beneficios</a>
            <a href="#ubicaciones" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 border-b border-blue-800/50 mb-2">Ubicaciones</a>
            <Link to="/login" className="bg-white text-[#003366] text-center py-3 rounded-xl font-bold shadow-md">
              Ingresar
            </Link>
          </div>
        )}
      </nav>

      {/* ================================================================
        2. HERO SECTION (PORTADA)
        ================================================================
        Contiene la imagen principal de fondo con un overlay (capa oscura)
        para asegurar que el texto blanco sea legible.
      */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Fondo e Imagen */}
        <div className="absolute inset-0 z-0">
            <img 
                src="/landing/hero-bg.jpg" 
                alt="Estudiantes UBB en bicicleta" 
                className="w-full h-full object-cover"
                // Fallback: Si la imagen local falla, carga una de Unsplash automáticamente.
                onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1470&auto=format&fit=crop'}} 
            />
            {/* Gradiente azul superpuesto para mejorar contraste del texto */}
            <div className="absolute inset-0 bg-linear-to-r from-[#003366]/90 via-[#003366]/70 to-transparent"></div>
        </div>

        {/* Contenido del Hero */}
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
                Ver Bicicleteros
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================
        3. SECCIÓN DE BENEFICIOS
        ================================================================
        Grid de 3 columnas mostrando las características clave.
      */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mb-4">Seguridad y Tecnología</h2>
            <p className="text-gray-600">Hemos modernizado nuestros bicicleteros para brindarte la tranquilidad que necesitas mientras estudias.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Tarjeta 1: Protección */}
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-gray-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Shield className="text-[#003366] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Protección Integral</h3>
              <p className="text-gray-600 leading-relaxed">
                Control de acceso restringido solo a estudiantes y funcionarios autorizados. Vigilancia presencial y monitoreo constante.
              </p>
            </div>

            {/* Tarjeta 2: QR Digital */}
            <div className="bg-gray-50 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-gray-100 group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Smartphone className="text-[#003366] w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Ingreso Digital QR</h3>
              <p className="text-gray-600 leading-relaxed">
                Olvídate de los trámites en papel. Genera tu código QR único desde tu celular y accede en segundos.
              </p>
            </div>

            {/* Tarjeta 3: Disponibilidad */}
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
        4. SECCIÓN DE UBICACIONES
        ================================================================
        Muestra las tarjetas con fotos reales de los bicicleteros.
      */}
      <section id="ubicaciones" className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Campus Concepción</span>
              <h2 className="text-[#003366] text-3xl md:text-4xl font-bold mt-2">Nuestros Espacios</h2>
            </div>
            <div className="hidden md:block h-1 w-20 bg-[#003366] mb-2"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Ubicación 1: FACE */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <img 
                    src="/landing/bici-face.jpg" 
                    alt="Bicicletero FACE" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    // Manejo de error de imagen
                    onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1505705694340-019e1e335916?q=80&w=1632&auto=format&fit=crop'}}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Bicicletero FACE</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin size={14} className="mr-1" /> Entre las aulas AC y la FACE
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Horario: 08:00 - 21:00</span>
                </div>
              </div>
            </div>

            {/* Ubicación 2: Idiomas */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <img 
                    src="/landing/bici-idiomas.jpg" 
                    alt="Bicicletero Idiomas" 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1632&auto=format&fit=crop'}}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Bicicletero Idiomas</h3>
                        <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPin size={14} className="mr-1" /> Frente a las salas de Idiomas
                        </div>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Horario: 08:00 - 20:00</span>
                </div>
              </div>
            </div>

             {/* Ubicación 3: Placeholder (Espacio para futuros bicicleteros) */}
             <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden shadow-sm flex flex-col justify-center items-center p-8 text-center min-h-75">
                <div className="bg-gray-200 p-4 rounded-full mb-4">
                    <Info size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-500 mb-2">Próximamente</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                    Cuando hayan nuevos bicicleteros habilitados en el campus, aparecerán listados en esta sección.
                </p>
             </div>

          </div>
        </div>
      </section>

      {/* ================================================================
        5. FOOTER (PIE DE PÁGINA)
        ================================================================
        Información de copyright y marca. Usa el mismo color base que el header.
      */}
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