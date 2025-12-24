export const CardBicycleRack = ({ bicicletero }) => {
  const { nombre, capacidad_maxima, imagen } = bicicletero

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm mx-8 my-4 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative h-48 w-full bg-gray-200">
        <img src="./public/bicicletero.png" alt="Imagen Bicicletero" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div 
        className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {bicicleterosData.map((bici) => (
          <div 
            key={bici.id} 
            className="shrink-0 w-80 bg-white rounded-xl shadow-lg border border-gray-100 snap-center overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={bici.imagen} 
                alt={bici.nombre} 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">{bici.nombre}</h3>
              
              <div className="space-y-2 text-gray-600 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>Ubicación: {bici.ubicacion}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  <span>Horario: {bici.horario}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home size={16} className="text-blue-500" />
                  <span>{bici.tipo}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Disponibilidad</span>
                  <span className="font-semibold text-blue-600">{bici.disponibilidad}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-slate-700 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${bici.disponibilidad}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardBicycleRack;