import { useState, useCallback } from "react";
import { toast } from "sonner";

/**
 * @hook useGeolocation
 * @description Hook personalizado para obtener la ubicación geográfica actual del usuario.
 * Utiliza la API de Geolocalización del navegador y muestra notificaciones con toast.
 * @returns {Object} Objeto con el estado de carga y la función para obtener ubicación.
 * @returns {boolean} returns.loading - Indica si se está obteniendo la ubicación actualmente.
 * @returns {Function} returns.getCurrentLocation - Función para solicitar la ubicación actual.
 * 
 */
  export function useGeolocation() {
  const [loading, setLoading] = useState(false);

  /**
   * @function getCurrentLocation
   * @description Obtiene la ubicación actual del usuario usando la API de geolocalización.
   * @param {Function} onSuccess - Callback que recibe (latitud, longitud) cuando se obtiene la ubicación.
   * @param {Function} [onError] - Callback que recibe el error si falla la geolocalización (opcional).
   */
  const getCurrentLocation = useCallback((onSuccess, onError) => {
    if (!navigator.geolocation) {
      toast.error("Navegador no soporta geolocalización");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onSuccess(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        console.error(err);
        if (onError) onError(err);
        else toast.error("No se pudo obtener la ubicación");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return { loading, getCurrentLocation };
}