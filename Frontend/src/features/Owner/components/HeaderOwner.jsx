
const HeaderOwner = ({user}) => {

  return (
    <header className="max-sm:bg-gray-200 max-sm:p-1 flex justify-between items-center mb-8 ml-8 ">
      <div className="flex flex-col md:mt-6 max-sm:text-center max-sm:mt-8">
        <h1 className="text-2xl font-bold text-[#1e3a8a]">Hola, {user.nombre}</h1>
        <p className="text-slate-500 text-sm">
          Bienvenido al sistema de gestión de bicicletas
        </p>
      </div>

      <div className="flex items-center gap-4 mr-4 max-sm:mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold">
          {user.nombre.charAt(0)}
          {user.apellido.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default HeaderOwner;
