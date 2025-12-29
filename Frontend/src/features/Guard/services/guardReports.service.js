import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Servicio para obtener el listado completo de reportes desde el servidor.
 * * Realiza una petición HTTP GET al endpoint de guardias.
 * * Maneja los errores extrayendo el mensaje específico enviado por el backend.
 * * @async
 * @function getAllReportsService
 * @returns {Promise<import('axios').AxiosResponse>} Promesa que resuelve con la respuesta completa de Axios (acceder a los datos mediante `.data`).
 * @throws {string} Lanza una excepción con el mensaje de error del servidor o un mensaje genérico de falla.
 */

export const getAllReportsService = async () => {
    try {
        const res = await axios.get(
        `${API_URL}/guards/report/getAllReports`
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

/**
 * Envía los datos al servidor para registrar un nuevo reporte de incidente.
 * * Esta función realiza una petición POST enviando la información del siniestro
 * y la lista de correos a notificar.
 * * @async
 * @function createReportService
 * @param {string[]} emails - Lista de correos electrónicos de los afectados (ej: `['juan@ubb.cl', 'admin@ubb.cl']`).
 * @param {string} fecha - Fecha y hora del incidente (formato string compatible con el backend).
 * @param {string} bicicletero - Identificador o nombre del bicicletero involucrado.
 * @param {string} descripcion - Detalles descriptivos del incidente.
 * @returns {Promise<import('axios').AxiosResponse>} Promesa que resuelve con la respuesta del servidor (status 200/201).
 * @throws {string} Lanza el mensaje de error del backend si la solicitud falla (ej: validación incorrecta).
 */

export const createReportService = async (emails, fecha, bicicletero, descripcion) => {
    try {
        const res = await axios.post(`${API_URL}/guards/report/createReport`, {
        emails,
        fecha, 
        bicicletero,
        descripcion
      })
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

/**
 * Envía una solicitud de actualización para modificar la descripción de un reporte.
 * * Realiza una petición PUT al servidor.
 * * Mapea el argumento `id_informe` a la propiedad `ID_Informe` que espera el backend.
 * * @async
 * @function editReportService
 * @param {number} id_informe - El ID numérico único del reporte a editar.
 * @param {string} descripcion - El nuevo texto descriptivo que reemplazará al anterior.
 * @returns {Promise<import('axios').AxiosResponse>} Promesa con la respuesta del servidor (confirmación de actualización).
 * @throws {string} Lanza el mensaje de error del servidor si el reporte no existe o los datos son inválidos.
 */

export const editReportService = async (id_informe, descripcion) => {
    try {
        const res = await axios.put(
        `${API_URL}/guards/report/updateReport`,
            {
            ID_Informe: id_informe,
            descripcion
            }
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

/**
 * Servicio para obtener el listado completo de dueños (owners) registrados.
 * * Realiza una petición HTTP GET al endpoint de usuarios/dueños.
 * * Útil para llenar tablas o listas de selección en el frontend.
 * * @async
 * @function getAllOwnersService
 * @returns {Promise<import('axios').AxiosResponse>} Promesa que resuelve con la respuesta de Axios (contiene la lista de owners en `.data`).
 * @throws {string} Error propagado con el mensaje del backend o un mensaje genérico.
 */

export const getAllOwnersService = async () => {
    try {
        const res = await axios.get(`${API_URL}/owners/getAllOwners`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

/**
 * Obtiene la lista de dueños (owners) asociados a un bicicletero específico.
 * * Realiza una petición GET enviando el ID como parámetro de consulta (Query Param).
 * * Útil para filtrar usuarios cuando un guardia selecciona un bicicletero en la interfaz.
 * * @async
 * @function getOwnersByBicicleteroService
 * @param {string|number} id_bicicletero - Identificador único del bicicletero a consultar.
 * @returns {Promise<import('axios').AxiosResponse>} Promesa que resuelve con la respuesta del servidor (contiene la lista de dueños filtrada).
 * @throws {string} Lanza el mensaje de error del backend si falla la consulta.
 */

export const getOwnersByBicicleteroService = async (id_bicicletero) => {
    try {
      console.log(id_bicicletero)
        const res = await axios.get(`${API_URL}/guards/getOwnersByBicicletero?id_bicicletero=${id_bicicletero}`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

/**
 * Obtiene el catálogo completo de bicicleteros (estacionamientos de bicicletas) disponibles.
 * * Realiza una petición GET al servidor.
 * * Este servicio es esencial para poblar listas desplegables donde el guardia debe seleccionar
 * una ubicación específica al crear un reporte o buscar usuarios.
 * * @async
 * @function getBicicleterosService
 * @returns {Promise<import('axios').AxiosResponse>} Promesa que resuelve con la respuesta del servidor (lista de bicicleteros).
 * @throws {string} Lanza el mensaje de error del servidor si la solicitud falla.
 */

export const getBicicleterosService = async () => {
    try {
        const res = await axios.get(`${API_URL}/guards/getBicicleteros`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}