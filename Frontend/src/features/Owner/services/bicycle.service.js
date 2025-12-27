import api from "../../../config/axios.config.js";

/**
 * @brief Obtiene el listado de bicicletas asociadas a un dueño.
 *
 * Realiza una petición GET al endpoint `/bicycles/owner/`.
 * Se utiliza principalmente para poblar la vista "Mis Bicicletas" del panel de dueño.
 *
 * @param {string} rut RUT del dueño para filtrar las bicicletas.
 * @returns {Promise<Array>} Retorna un arreglo con los objetos de las bicicletas encontradas.
 * @throws {Object} Lanza el error del backend si el RUT no existe o hay fallo interno.
 */
export const getBicyclesByOwnerService = async (rut) => {
  try {
    const response = await api.get(`/bicycles/owner/`, {
      params: { rut },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

/**
 * @brief Registra una nueva bicicleta en el sistema.
 *
 * Realiza una petición POST al endpoint `/bicycles/create`.
 * Envía los datos del formulario (alias, marca, modelo, color, tipo, rut_duenio).
 *
 * @param {Object} bicycleData Objeto con la información de la nueva bicicleta.
 * @returns {Promise<Object>} Retorna el objeto de la bicicleta recién creada.
 * @throws {Object} Lanza error si fallan las validaciones (ej: alias duplicado).
 */
export const createBicycleService = async (bicycleData) => {
  try {
    const response = await api.post(`/bicycles/create`, bicycleData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

/**
 * @brief Elimina una bicicleta específica de la base de datos.
 *
 * Realiza una petición DELETE al endpoint `/bicycles/delete/:id`.
 * Esta acción es irreversible y requiere confirmación previa en el frontend.
 *
 * @param {number|string} id_bicicleta ID único de la bicicleta a eliminar.
 * @returns {Promise<Object>} Retorna confirmación de la eliminación.
 * @throws {Object} Lanza error si la bicicleta no existe o no se puede borrar.
 */
export const deleteBicycleService = async (id_bicicleta) => {
  try {
    const response = await api.delete(`/bicycles/delete/${id_bicicleta}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
