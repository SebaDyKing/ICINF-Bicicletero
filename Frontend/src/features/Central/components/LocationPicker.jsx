import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Loader2, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "sonner";

import { AddressSearch } from "./AddressSearch";
import { MapUpdater, MapFix, MapClickEvents } from "../utils/mapHelpers";
import { useGeolocation } from "../hooks/useGeolocation";


const DEFAULT_CENTER = [-36.8211397, -73.0122850];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function LocationPicker({ lat, lng, onChange }) {
  const { loading: loadingLoc, getCurrentLocation } = useGeolocation();
  
  const position = (lat && lng) ? [Number(lat), Number(lng)] : null;

  const handleGpsClick = () => {
    getCurrentLocation((latitude, longitude) => {
      onChange(latitude, longitude);
      toast.success("Ubicación actual encontrada");
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <label className="block text-sm font-medium text-gray-700">Ubicación</label>
        <button
          type="button"
          onClick={handleGpsClick}
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