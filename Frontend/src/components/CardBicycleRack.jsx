import { MapPin, Clock, Home } from 'lucide-react'; 

const bicicleterosData = [
  {
    id: 1,
    nombre: "Bicicletero FACE",
    ubicacion: "FACE",
    horario: "hasta las 9",
    tipo: "Nave",
    disponibilidad: 60,
    imagen: "https://images.unsplash.com/photo-1485965120184-e224f7a1dbfe?q=80&w=1000&auto=format&fit=crop" // Imagen de prueba
  },
  {
    id: 2,
    nombre: "Bicicletero Centro de Idiomas",
    ubicacion: "Idiomas",
    horario: "hasta las 9",
    tipo: "Abierto",
    disponibilidad: 40,
    imagen: "https://images.unsplash.com/photo-1507035895480-2b3156c31158?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    nombre: "Bicicletero Central",
    ubicacion: "Biblioteca",
    horario: "hasta las 21",
    tipo: "Techado",
    disponibilidad: 80,
    imagen: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 4,
    nombre: "Bicicletero Norte",
    ubicacion: "Entrada Norte",
    horario: "hasta las 20",
    tipo: "Nave",
    disponibilidad: 90,
    imagen: "https://images.unsplash.com/photo-1529422643029-d4585747aaf2?q=80&w=1000&auto=format&fit=crop"
  },
];

const CardBicycleRack = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Conoce a nuestros Bicicleteros</h2>
        <p className="text-gray-500 text-sm">
          ← Desliza horizontalmente para ver más bicicleteros →
        </p>
      </div>

      {/* Contenedor del Scroll Horizontal */}
      <div 
        className="flex overflow-x-auto pb-6 gap-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        {bicicleterosData.map((bici) => (
          <div 
            key={bici.id} 
            className="shrink-0 w-80 bg-white rounded-xl shadow-lg border border-gray-100 snap-center overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen */}
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={bici.imagen} 
                alt={bici.nombre} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Contenido de la tarjeta */}
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

              {/* Barra de Progreso */}
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