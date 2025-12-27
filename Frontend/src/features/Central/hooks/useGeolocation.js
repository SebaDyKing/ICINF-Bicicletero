import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useGeolocation() {
  const [loading, setLoading] = useState(false);

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