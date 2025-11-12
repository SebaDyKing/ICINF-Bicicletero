export const CardBicycleRack = ({ bicicletero }) => {
    const {nombre, capacidad_maxima, imagen } = bicicletero

    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-8 my-4">
      <div className="relative h-48 w-full bg-gray-200">
        <img src="./public/bicicletero.png" alt="Imagen Bicicletero" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{nombre}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <span>Horario: 8:00 am - 21:00 pm </span>
        </div>
        <div className="text-sm text-gray-700 mt-3">
          <div className="flex items-center mb-1">
            <span>Capacidad Maxima {capacidad_maxima}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
