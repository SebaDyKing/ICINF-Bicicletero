import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Loader2, Navigation, Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";

const DEFAULT_CENTER = [-33.4489, -70.6693]; 

/**
 * Componente interno para buscar direcciones usando la API de Nominatim (OSM).
 * Muestra un input con autocompletado.
 *
 * @param {Object} props
 * @param {(lat: number, lng: number) => void} props.onSelectAddress - Callback al seleccionar una dirección.
 */
function AddressSearch({ onSelectAddress }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=cl&limit=5`
          );
          const data = await response.json();
          setResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Error buscando dirección:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 150); 

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result) => {
    setQuery(result.display_name); 
    setShowResults(false);
    onSelectAddress(result.lat, result.lon); 
    toast.success("Ubicación actualizada desde búsqueda");
  };

  return (
    <div ref={wrapperRef} className="relative w-full mb-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar calle, comuna o lugar..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setShowResults(true)}
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <ul className="absolute z-[1000] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {results.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0 border-gray-100 flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-700">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Componente lógico que gestiona el movimiento de la cámara del mapa.
 *
 * @param {Object} props
 * @param {[number, number] | null} props.position - Las coordenadas actuales.
 * @returns {null}
 */
function MapUpdater({ position }) {
  const map = useMap();
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      if (position) map.setView(position, 16);
      else map.setView(DEFAULT_CENTER, 13);
      return; 
    }

    if (position) map.flyTo(position, 16, { duration: 1.5 });
    else map.flyTo(DEFAULT_CENTER, 13, { duration: 1.5 });
  }, [position, map]);

  return null;
}

/**
 * Componente utilitario para forzar el recálculo de dimensiones del mapa.
 * @returns {null}
 */
function MapFix() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

/**
 * Manejador de eventos de clic en el mapa.
 * @param {Object} props
 * @param {(lat: number, lng: number) => void} props.onLocationSelect
 */
function MapClickEvents({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

/**
 * Componente principal de selección de ubicación.
 * Integra Búsqueda de Direcciones + Mapa + Geolocalización.
 *
 * @component
 * @param {Object} props
 * @param {string | number} props.lat - Latitud actual.
 * @param {string | number} props.lng - Longitud actual.
 * @param {(lat: number, lng: number) => void} props.onChange - Actualiza estado padre.
 * @returns {JSX.Element}
 */
export function LocationComponent({ lat, lng, onChange }) {
  const [loadingLoc, setLoadingLoc] = useState(false);
  const position = (lat && lng) ? [Number(lat), Number(lng)] : null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Navegador no soporta geolocalización");
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setLoadingLoc(false);
        toast.success("Ubicación actual encontrada");
      },
      (err) => {
        console.error(err);
        setLoadingLoc(false);
        toast.error("Error al obtener GPS");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      {/* 1. Header con Título y Botón GPS */}
      <div className="flex justify-between items-end">
        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={loadingLoc}
          className="text-xs flex items-center gap-1 text-[#003366] hover:text-blue-700 font-medium transition-colors"
        >
          {loadingLoc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
          {loadingLoc ? "Buscando..." : "Usar mi ubicación"}
        </button>
      </div>

      <AddressSearch onSelectAddress={onChange} />

      <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
        <MapContainer 
          center={position || DEFAULT_CENTER} 
          zoom={position ? 16 : 13} 
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {position && <Marker position={position} />}
          
          <MapClickEvents onLocationSelect={onChange} />
          <MapUpdater position={position} />
          <MapFix />
        </MapContainer>

        {!position && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur text-xs p-2 rounded-lg text-center text-gray-500 z-[400] pointer-events-none">
            Busca una dirección o toca el mapa
          </div>
        )}
      </div>
    </div>
  );
}