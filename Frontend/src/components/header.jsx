// Frontend/src/components/header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    // "flex" -> display: flex
    // "justify-between" -> justify-content: space-between
    // "bg-blue-900" -> Un fondo azul oscuro (parecido al #004D99)
    // "text-white" -> color: white
    // "p-4" -> padding
    // "shadow-md" -> una sombra sutil
    <header className="grid grid-cols-3 items-center p-4 bg-blue-900 text-white shadow-md">

  {/* Izquierda: Logo */}
  <div className="flex items-center">
    <img src="/LogoUBB2.png" alt="UBB Logo" className="h-15 ml-10 mr-3" />
    <p className="font-bold text-xl tracking-wide ml-3">Universidad del Bío-Bío</p>
  </div>

  {/* Centro: Navegación */}
  <nav className="flex justify-center">
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

  {/* Derecha: Botón */}
  <div className="flex justify-end">
    <button
      className="bg-white text-blue-900 font-bold py-2 px-6 rounded hover:bg-gray-200"
      onClick={() => navigate('/login')}
    >
      Ingresar
    </button>
  </div>

</header>

  );
}

export default Header;