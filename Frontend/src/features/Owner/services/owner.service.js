import api from "../../../config/axios.config.js";

/**
 * @brief Obtiene la información completa del perfil de un dueño.
 * * Realiza una petición GET al endpoint `/owners/getOwner`.
 * Se utiliza para hidratar el estado del usuario en la aplicación (perfil, dashboard).
 * * @param {string} rut El RUT del dueño que se desea buscar (se envía como query param).
 * @returns {Promise<Object>} Retorna los datos del dueño (response.data.data).
 * @throws {Object} Lanza el error del backend o un mensaje genérico de conexión.
 */
export const getOwnerService = async (rut) => {
  try {
    const response = await api.get(`/owners/getOwner`, {
      params: { rut },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

/**
 * @brief Actualiza los datos personales de un dueño existente.
 * * Realiza una petición PUT al endpoint `/owners/updateOwner`.
 * Envía el objeto completo o parcial con las modificaciones deseada.
 * * @param {Object} ownerData Objeto con los datos a actualizar (ej: { rut, nombre, correo, telefono }).
 * @returns {Promise<Object>} Retorna los datos actualizados confirmados por el servidor.
 * @throws {Object} Error si la validación falla o hay problemas de servidor.
 */
export const updateOwnerService = async (ownerData) => {
  try {
    const response = await api.put(`/owners/updateOwner`, ownerData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};