// Frontend/src/components/header.jsx
import React from 'react';

function Header() {
  return (
    // "flex" -> display: flex
    // "justify-between" -> justify-content: space-between
    // "bg-blue-900" -> Un fondo azul oscuro (parecido al #004D99)
    // "text-white" -> color: white
    // "p-4" -> padding
    // "shadow-md" -> una sombra sutil
    <header className="flex justify-between items-center p-4 bg-blue-900 text-white shadow-md">
      
      {/* Sección Izquierda: Logo y Marca */}
      <div className="flex items-center">
        <img src="/logo-ubb.png" alt="UBB Logo" className="h-10 mr-2" /> {/* h-10 es la altura */}
        <span className="text-2xl font-bold">UBB</span>
      </div>

      {/* Navegación Central */}
      <nav>
        <ul className="flex space-x-8"> {/* space-x-8 añade espacio entre los 'li' */}
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

      {/* Botón Derecho */}
      <div>
        <button className="bg-white text-blue-900 font-bold py-2 px-6 rounded hover:bg-gray-200">
          Login Guardias
        </button>
      </div>

    </header>
  );
}

export default Header;