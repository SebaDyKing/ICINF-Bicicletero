import api from "../../../config/axios.config";

/**
 * @async
 * @function createGuardService
 * @description Crea un nuevo guardia en el sistema.
 * @param {string} rut - RUT del guardia.
 * @param {string} email - Correo electrónico del guardia.
 * @param {string} contrasenia - Contraseña del guardia.
 * @param {string} telefono - Número de teléfono del guardia.
 * @param {string} nombre - Nombre del guardia.
 * @param {string} apellido - Apellido del guardia.
 * @returns {Promise<Object>} Respuesta del servidor con los datos del guardia creado.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const createGuardService = async (rut, email, contrasenia, telefono, nombre, apellido) => {
  try {
    const res = await api.post(`/central/createGuard`, {
      rut,
      email,
      contrasenia,
      telefono,
      nombre,
      apellido
    });
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function updateGuardService
 * @description Actualiza los datos de un guardia existente.
 * @param {string} rut - RUT del guardia a actualizar.
 * @param {string} email - Nuevo correo electrónico del guardia.
 * @param {string} contrasenia - Nueva contraseña del guardia.
 * @param {string} telefono - Nuevo número de teléfono del guardia.
 * @returns {Promise<Object>} Respuesta del servidor con los datos del guardia actualizado.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const updateGuardService = async (rut, email, contrasenia, telefono) => {
  try {
    const res = await api.put(
      `/central/updateGuard`,
      {
        rut,
        email,
        contrasenia,
        telefono
      }
    );
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function deleteGuardService
 * @description Elimina un guardia del sistema por su RUT.
 * @param {string} rut - RUT del guardia a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor confirmando la eliminación.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const deleteGuardService = async (rut) => {
  try {
    const res = await api.delete(
      `/central/deleteGuard`,
      {
        data: { rut },
      });
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function getAllGuardService
 * @description Obtiene la lista de todos los guardias registrados en el sistema.
 * @returns {Promise<Object>} Respuesta del servidor con el array de guardias.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const getAllGuardService = async () => {
  try {
    const res = await api.get(`/central/getAllGuards`);
    return res
  } catch (error) {
    console.log(error);
    throw error || "Error en la solicitud";
  }
}

/**
 * @async
 * @function getGuardService
 * @description Obtiene los datos de un guardia específico por su RUT.
 * @param {string} rut - RUT del guardia a consultar.
 * @returns {Promise<Object>} Respuesta del servidor con los datos del guardia.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const getGuardService = async (rut) => {
  try {
    const res = await api.get(
      `/central/getGuard?rut=${rut}`
    );
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function getUserService
 * @description Obtiene los datos de un usuario (owner) específico por su RUT.
 * @param {string} rut - RUT del usuario a consultar.
 * @returns {Promise<Object>} Respuesta del servidor con los datos del usuario.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const getUserService = async (rut) => {
  try {
    const res = await api.get(
      `/central/getUser?rut=${rut}`
    );
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function getAllReportsService
 * @description Obtiene la lista de todos los reportes/informes generados por los guardias.
 * @returns {Promise<Object>} Respuesta del servidor con el array de reportes.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const getAllReportsService = async () => {
  try {
    const res = await api.get(
      `/guards/report/getAllReports`
    );
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function deleteOwnerService
 * @description Elimina un propietario/usuario del sistema por su RUT.
 * @param {string} rut - RUT del propietario a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor confirmando la eliminación.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const deleteOwnerService = async (rut) => {
  try {
    const res = await api.delete(
      `/central/deleteOwner`,
      {
        data: { rut },
      });
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}

/**
 * @async
 * @function deleteReportService
 * @description Elimina un reporte/informe específico por su ID.
 * @param {number} ID_Informe - ID del informe a eliminar.
 * @returns {Promise<Object>} Respuesta del servidor confirmando la eliminación.
 * @throws {string} Mensaje de error si la solicitud falla.
 */
export const deleteReportService = async (ID_Informe) => {
  try {
    const res = await api.delete(
      `/guards/report/deleteReport`,
      {
        data: { ID_Informe },
      }
    );
    return res
  } catch (error) {
    console.log(error);
    throw error.response?.data?.message || "Error en la solicitud";
  }
}