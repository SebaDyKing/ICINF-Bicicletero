import api from "../../../config/axios.config";

/**
 * @object guardService
 * @description Servicio encargado de todas las operaciones HTTP relacionadas con el rol de Guardia.
 * Utiliza la instancia centralizada 'api' para manejar base URL y tokens automáticamente.
 */
export const guardService = {
  
  /**
   * @function getRegistrosActivos
   * @description Obtiene la lista de todas las bicicletas que se encuentran actualmente dentro del recinto.
   * @returns {Promise<Array>} Promesa que resuelve con la lista de registros activos.
   */
  getRegistrosActivos: async () => {
    try {
      const response = await api.get('/guards/activos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener registros activos" };
    }
  },

  /**
   * @function getCapacidades
   * @description Consulta el estado de ocupación de cada bicicletero en tiempo real.
   * @returns {Promise<Array>} Promesa con lista de bicicleteros y ocupación.
   */
  getCapacidades: async () => {
    try {
      const response = await api.get('/guards/capacidades');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener capacidades" };
    }
  },

  /**
   * @function getBicicleteros
   * @description Obtiene el catálogo de ubicaciones (racks) disponibles.
   * @returns {Promise<Array>} Promesa con la lista de bicicleteros.
   */
  getBicicleteros: async () => {
    try {
      const response = await api.get('/bicicleteros');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al cargar bicicleteros" };
    }
  },

  /**
   * @function registrarRetiro
   * @description Registra la salida de una bicicleta del recinto.
   * @param {number|string} id_bicicleta - ID único de la bicicleta que se retira.
   */
  registrarRetiro: async (id_bicicleta) => {
    try {
      const response = await api.put('/guards/retiro', { id_bicicleta });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al registrar retiro" };
    }
  },

  /**
   * @function registrarIngreso
   * @description Registra la entrada de una bicicleta al recinto.
   * @param {Object} data - Datos del ingreso (rut_owner, id_bicicleta, id_bicicletero).
   */
  registrarIngreso: async (data) => {
    try {
      const response = await api.post('/guards/ingreso', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al registrar ingreso" };
    }
  },

  /**
   * @function getOwnerWithBicycles
   * @description Busca un dueño por su RUT y trae sus bicicletas.
   * @param {string} rut - RUT del usuario a buscar.
   */
  getOwnerWithBicycles: async (rut) => {
    try {
      const response = await api.get(`/bicycles/owner-full/${rut}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al buscar usuario" };
    }
  },

  /**
   * @function getEstadisticas
   * @description Obtiene métricas rápidas del día.
   */
  getEstadisticas: async () => {
    try {
      const response = await api.get('/guards/estadisticas');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Error al obtener estadísticas" };
    }
  },
};