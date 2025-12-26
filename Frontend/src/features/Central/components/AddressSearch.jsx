import { useState, useRef } from "react";
import { Loader2, Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useAddressSearch } from "../hooks/useAddressSearch";
import { useClickOutside } from "../hooks/useClickOutsider";

export function AddressSearch({ onSelectAddress }) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  const { results, isSearching } = useAddressSearch(query, 200);
  
  useClickOutside(wrapperRef, () => setShowResults(false));

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
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
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
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0 border-gray-100 flex items-start gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-700 block truncate">{item.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}