import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * @function getAuthHeaders
 * @description Helper interno para generar los encabezados de autenticación.
 * Obtiene el token JWT del localStorage y lo formatea para la cabecera HTTP.
 * @returns {Object} Objeto con la propiedad 'headers' y el token Bearer.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

/**
 * @object guardService
 * @description Servicio encargado de todas las operaciones HTTP relacionadas con el rol de Guardia.
 * Incluye gestión de ingresos, salidas, monitoreo de capacidades y búsqueda de usuarios.
 */
export const guardService = {
  
  /**
   * @function getRegistrosActivos
   * @description Obtiene la lista de todas las bicicletas que se encuentran actualmente dentro del recinto (sin fecha de salida).
   * @returns {Promise<Array>} Promesa que resuelve con la lista de registros activos.
   */
  getRegistrosActivos: async () => {
    const response = await axios.get(`${API_URL}/guards/activos`, getAuthHeaders());
    return response.data;
  },

  /**
   * @function getCapacidades
   * @description Consulta el estado de ocupación de cada bicicletero en tiempo real.
   * @returns {Promise<Array>} Promesa con lista de bicicleteros, incluyendo capacidad máxima y ocupación actual.
   */
  getCapacidades: async () => {
    const response = await axios.get(`${API_URL}/guards/capacidades`, getAuthHeaders());
    return response.data;
  },

  /**
   * @function getBicicleteros
   * @description Obtiene el catálogo de ubicaciones (racks) disponibles para estacionar.
   * @returns {Promise<Array>} Promesa con la lista de bicicleteros (ID y nombre).
   */
  getBicicleteros: async () => {
    const response = await axios.get(`${API_URL}/bicicleteros`, getAuthHeaders());
    return response.data;
  },

  /**
   * @function registrarRetiro
   * @description Registra la salida de una bicicleta del recinto.
   * Cierra el ciclo de estacionamiento asignando una fecha de salida al registro.
   * @param {number|string} id_bicicleta - ID único de la bicicleta que se retira.
   * @returns {Promise<Object>} Promesa con el registro actualizado.
   */
  registrarRetiro: async (id_bicicleta) => {
    const response = await axios.put(
      `${API_URL}/guards/retiro`, 
      { id_bicicleta }, 
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * @function registrarIngreso
   * @description Registra la entrada de una bicicleta al recinto.
   * @param {Object} data - Datos del ingreso.
   * @param {string} data.rut_owner - RUT del dueño de la bicicleta.
   * @param {number} data.id_bicicleta - ID de la bicicleta que ingresa.
   * @param {number} data.id_bicicletero - ID del lugar donde se estacionará.
   * @returns {Promise<Object>} Promesa con el nuevo registro de ingreso creado.
   */
  registrarIngreso: async (data) => {
    const response = await axios.post(
      `${API_URL}/guards/ingreso`, 
      data, 
      getAuthHeaders()
    );
    return response.data;
  },

  /**
   * @function getOwnerWithBicycles
   * @description Busca un dueño por su RUT y trae anidadas todas sus bicicletas registradas.
   * @details Utilizado específicamente en el Modal de Ingreso Manual para mostrar nombre del alumno y sus bicis.
   * Apunta al endpoint personalizado 'owner-full'.
   * @param {string} rut - RUT del usuario a buscar (con o sin formato, según backend).
   * @returns {Promise<Object>} Promesa con los datos del dueño (nombre, apellido) y su lista de bicicletas.
   */
  getOwnerWithBicycles: async (rut) => {
    const response = await axios.get(`${API_URL}/bicycles/owner-full/${rut}`, getAuthHeaders());
    return response.data;
  },

  /**
   * @function getEstadisticas
   * @description Obtiene métricas rápidas del día (cantidad de ingresos y salidas hoy).
   * @returns {Promise<Object>} Promesa con objeto { ingresosHoy, retirosHoy }.
   */
  getEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/guards/estadisticas`, getAuthHeaders());
    return response.data;
  },
};