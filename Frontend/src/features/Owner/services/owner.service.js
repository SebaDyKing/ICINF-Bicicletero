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

export const getBicyclesByRut = async (rut) => {
  try {
    const response = await api.get(`/bicycles/owner/${rut}`);
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo bicicletas:", error);
    return null;
  }
};

/**
 * Nueva función para obtener el historial real desde el Backend.
 */
export const getOwnerHistory = async (rut) => {
  try {
    const response = await api.get(`/owners/history/${rut}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return [];
  }
};

/**
 * Obtiene la ocupación real de los bicicleteros.
 */
export const getBicicleterosStatus = async () => {
  try {
    const response = await api.get("/bicicleteros/status");
    return response.data.data || [];
  } catch (error) {
    console.error("Error cargando status bicicleteros:", error);
    return [];
  }
};

/**
 * @function solicitarGuardService
 * @brief Envía la solicitud de asistencia presencial al servidor.
 *
 * Esta función actúa como puente entre el Frontend y el Backend. Toma las coordenadas
 * GPS obtenidas del navegador y las envía al endpoint `/owners/solicitud` para que
 * el servidor valide la geocerca y emita la notificación vía WebSockets.
 *
 * @param {number} latitude Latitud geográfica actual del usuario.
 * @param {number} longitude Longitud geográfica actual del usuario.
 * @returns {Promise<Object>} Retorna la respuesta del servidor (mensaje de éxito y datos del bicicletero).
 * @throws {Object} Lanza un error con el mensaje del servidor (ej: "Estás muy lejos") o un error genérico de red.
 */
export const solicitarGuardService = async (latitude, longitude) => {
  try {
    const response = await api.post(`/owners/solicitud`, {
      lat: latitude,
      lon: longitude,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error:", error.response?.data);
    throw error.response?.data || { message: "Error de conexión con el servidor" };
  }
};
