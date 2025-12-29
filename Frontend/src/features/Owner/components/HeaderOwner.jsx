
/**
 * @component HeaderOwner
 * @brief Encabezado superior visual para el panel del Dueño.
 *
 * Muestra la información de bienvenida personalizada y el avatar del usuario conectado.
 * Se adapta visualmente dejando espacio a la izquierda en dispositivos móviles para
 * no solaparse con el botón del menú lateral (Hamburguesa).
 *
 * @param {Object} props Props del componente.
 * @param {Object} props.user Objeto con la información del usuario logueado.
 * @param {string} props.user.nombre Nombre del usuario.
 * @param {string} props.user.apellido Apellido del usuario.
 * @returns {JSX.Element} Renderiza el header con saludo y avatar.
 */
const HeaderOwner = ({ user }) => {
  return (
    <header
      className="
      w-full flex justify-between items-center bg-white 
      p-4 
      pl-16 md:pl-8  
      md:py-6 border-b border-slate-100 shadow-sm transition-all
    "
    >
      {/* Sección de Texto */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl md:text-2xl font-bold text-[#1e3a8a] leading-tight">
          Hola, {user.nombre}
        </h1>
        <p className="text-slate-500 text-xs md:text-sm font-medium">
          ¡Bienvenido al sistema de gestión de bicicletas!
        </p>
      </div>

      {/* Sección de Avatar */}
      <div className="flex items-center shrink-0 ml-4">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold text-sm md:text-lg shadow-sm">
          {user.nombre?.charAt(0).toUpperCase()}
          {user.apellido?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default HeaderOwner;
