import { useEffect, useState } from "react";
import { getOwnerService } from "../services/owner.service";

/**
 * @hook useUserData
 * @brief Hook para obtener la información detallada del perfil del dueño.
 *
 * Este hook se encarga de llamar al servicio `getOwnerService` cada vez que
 * cambia el RUT proporcionado. Es útil para cargar datos extendidos del usuario
 * (nombre, correo, teléfono) que no están en el contexto de autenticación básico.
 *
 * @param {string} rut El RUT del usuario a buscar.
 * @returns {Object|null} Retorna el objeto con los datos del usuario, o `null` si aún está cargando o no hay RUT.
 */
export const useUserData = (rut) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!rut) return;
    
    const fetchData = async () => {
      try {
        const result = await getOwnerService(rut);
        setUser(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [rut]);

  return user;
};
