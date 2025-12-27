import { useState, useEffect } from "react";

export function useAddressSearch(query, delay = 500) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length <= 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=cl&limit=5`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  return { results, isSearching };
}

