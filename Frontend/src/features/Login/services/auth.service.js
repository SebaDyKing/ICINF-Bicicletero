import api from "../../../config/axios.config.js";

/**
 * @function loginService
 * @brief Realiza la petición de inicio de sesión al servidor.
 *
 * Si las credenciales son válidas, guarda el token JWT y los datos del usuario
 * en el `localStorage` para mantener la sesión activa.
 *
 * @param {string} rut El RUT del usuario (formateado o limpio, según lo espere el backend).
 * @param {string} password La contraseña en texto plano.
 * @returns {Promise<Object>} Los datos del usuario logueado (incluyendo rol y token).
 * @throws {Error} Error con el mensaje del backend (ej: "Credenciales inválidas") o error de conexión.
 */
export const loginService = async (rut, password) => {
  try {
    const response = await api.post(`/auth/login`, {
      rut: rut,
      contrasenia: password,
    });

    const { data } = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (error) {
    // Manejo de errores para leer el mensaje que envía el backend
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error desconocido");
    }
    throw new Error("Error de conexión con el servidor");
  }
};

/**
 * @function logoutService
 * @brief Cierra la sesión del usuario en el navegador.
 *
 * Elimina el token y los datos de usuario del almacenamiento local,
 * obligando al usuario a loguearse nuevamente para acceder a rutas protegidas.
 */
export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * @function registerOwnerService
 * @brief Registra un nuevo dueño de bicicleta en el sistema.
 *
 * @param {Object} userData Objeto con los datos del formulario de registro (rut, nombre, email, etc.).
 * @returns {Promise<Object>} Respuesta del servidor confirmando la creación.
 */
export const registerOwnerService = async (userData) => {
  try {
    const response = await api.post(`/owners/createOwner`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

/**
 * @function verifyAccountService
 * @brief Valida el código de verificación (OTP) para activar una cuenta.
 *
 * @param {string} email Correo electrónico del usuario a verificar.
 * @param {string} codigo Código de 6 dígitos ingresado por el usuario.
 * @returns {Promise<Object>} Respuesta de éxito si el código es correcto y no ha expirado.
 */
export const verifyAccountService = async (email, codigo) => {
  try {
    const response = await api.post(`/auth/authenticate`, { email, codigo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
