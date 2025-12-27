import { useEffect, useState, useCallback } from "react";
import { getBicyclesByOwnerService } from "../services/bicycle.service.js";

/**
 * @hook useBikeData
 * @brief Hook personalizado para gestionar la obtención y estado de las bicicletas.
 *
 * Encapsula la lógica de comunicación con el servicio `getBicyclesByOwnerService`.
 * Maneja automáticamente los estados de carga y refresco de datos cuando cambia el RUT.
 *
 * @param {string} ownerRut El RUT del dueño. Si es null/undefined, no ejecuta la petición.
 * @returns {Object} Objeto con:
 * - bikes: Array de bicicletas.
 * - setBikes: Función para actualizar el estado localmente.
 * - loading: Booleano que indica si se están buscando datos.
 */
export const useBikeData = (ownerRut) => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * @brief Función asíncrona para traer los datos.
   *
   * Se envuelve en `useCallback` para memorizar la referencia de la función.
   * Esto evita que se recree en cada renderizado del componente, lo que
   * causaría que el `useEffect` dependiente se ejecutara infinitamente o innecesariamente.
   */
  const fetchBikes = useCallback(async () => {
    if (!ownerRut) return;
    try {
      setLoading(true);
      const result = await getBicyclesByOwnerService(ownerRut);
      setBikes(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [ownerRut]);

  /**
   * @brief Efecto desencadenante.
   * Ejecuta la petición cuando el componente se monta o cuando cambia el `ownerRut`.
   */
  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  // Retornamos un objeto con todo lo necesario
  return { bikes, setBikes, loading };
};
