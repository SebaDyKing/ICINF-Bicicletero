import { useState, useEffect } from "react";

/**
 * @hook useAddressSearch
 * @description Hook personalizado para buscar direcciones usando la API de OpenStreetMap (Nominatim).
 * Implementa debouncing para evitar múltiples peticiones innecesarias.
 * @param {string} query - Término de búsqueda para la dirección.
 * @param {number} [delay=500] - Tiempo de espera en milisegundos antes de ejecutar la búsqueda (debounce).
 * @returns {Object} Objeto con los resultados y estado de búsqueda.
 * @returns {Array} returns.results - Array de resultados de direcciones encontradas.
 * @returns {boolean} returns.isSearching - Indica si se está ejecutando una búsqueda actualmente.
 */
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
