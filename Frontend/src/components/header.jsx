// Frontend/src/components/header.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); //Menu para celulares

  return (
    <header className="grid grid-cols-2 md:grid-cols-3 items-center p-4 bg-blue-900 text-white shadow-md">

      <div className="flex items-center col-span-1">
        <img src="/LogoUBB2.png" alt="UBB Logo" className="h-11 md:h-15 ml-4 md:ml-10 mr-2" />
        <p className="font-bold text-lg md:text-xl tracking-wide ml-3">UBB</p>
      </div>

      <div className="flex justify-end items-center col-span-1 md:hidden">
        <button
          className="bg-white text-blue-900 font-bold py-1 px-3 text-sm rounded hover:bg-gray-200 mr-4"
          onClick={() => navigate('/login')}
        >
          Ingresar
        </button>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="p-2 border border-white rounded focus:outline-none"
        >
          {/* Ícono de Hamburger */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      {/* Centro (Escritorio): Navegación Principal */}
      {/* Oculto en móvil, visible a partir de 'md' */}
      <nav className="hidden md:flex justify-center md:col-span-1">
        <ul className="flex space-x-10 text-lg">
          <li>
            <a href="#bicicleteros" className="font-medium hover:text-blue-300">
              Bicicleteros
            </a>
          </li>
          <li>
            <a href="#reportes" className="font-medium hover:text-blue-300">
              Reportes
            </a>
          </li>
          <li>
            <a href="#contacto" className="font-medium hover:text-blue-300">
              Contacto
            </a>
          </li>
        </ul>
      </nav>

      {/* Botón de Ingresar */}
      {/* Oculto en móvil, visible a partir de 'md' */}
      <div className="hidden md:flex justify-end md:col-span-1">
        <button
          className="bg-white text-blue-900 font-bold py-2 px-6 rounded hover:bg-gray-200 mr-10"
          onClick={() => navigate('/login')}
        >
          Ingresar
        </button>
      </div>

      {/* Se muestra si 'isMenuOpen' es true y el tamaño de pantalla es menor a 'md' */}
      {isMenuOpen && (
        <div className="md:hidden col-span-2 bg-blue-800 absolute top-16 left-0 right-0 z-10 p-4 shadow-lg">
          <ul className="flex flex-col space-y-3 text-white text-lg">
            <li>
              <a href="#bicicleteros" className="font-medium hover:text-blue-300 block py-2" onClick={() => setIsMenuOpen(false)}>
                Bicicleteros
              </a>
            </li>
            <div className="border-t border-blue-700"></div> {/* Separador */}
            <li>
              <a href="#reportes" className="font-medium hover:text-blue-300 block py-2" onClick={() => setIsMenuOpen(false)}>
                Reportes
              </a>
            </li>
            <div className="border-t border-blue-700"></div>
            <li>
              <a href="#contacto" className="font-medium hover:text-blue-300 block py-2" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;

