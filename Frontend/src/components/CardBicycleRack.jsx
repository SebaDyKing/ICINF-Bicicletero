export const CardBicycleRack = ({ bicicletero }) => {
    const {nombre, capacidad_maxima, imagen } = bicicletero

    return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-auto my-4">
      <div className="relative h-48 w-full bg-gray-200">
        <img src={imagen} alt="Imagen Bicicletero" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{nombre}</h3>
        {/* <div className="flex items-center text-gray-600 text-sm mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Nombre: {nombre}</span>
        </div> */}
        <div className="flex items-center text-gray-600 text-sm mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Horario: 8:00 am - 21:00 pm </span>
        </div>
        <div className="text-sm text-gray-700 mt-3">
          <div className="flex justify-between items-center mb-1">
            <span>Capacidad Maxima</span>
            <span className="font-medium">{capacidad_maxima}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${capacidad_maxima}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
