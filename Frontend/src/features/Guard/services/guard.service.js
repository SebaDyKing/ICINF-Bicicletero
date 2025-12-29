import api from "../../../config/axios.config"; 

/**
 * @object guardService
 * @description Servicio conectado a la instancia 'api' para despliegue.
 */
export const guardService = {
  
  /**
   * @function getRegistrosActivos
   */
  getRegistrosActivos: async () => {
    // Al usar api.get, si falla, Axios lanza el error automáticamente.
    // Dejamos que ese error suba hasta el componente.
    const response = await api.get('/guards/activos');
    return response.data;
  },

  /**
   * @function getCapacidades
   */
  getCapacidades: async () => {
    const response = await api.get('/guards/capacidades');
    return response.data;
  },

  /**
   * @function getBicicleteros
   */
  getBicicleteros: async () => {
    const response = await api.get('/bicicleteros');
    return response.data;
  },

  /**
   * @function registrarRetiro
   */
  registrarRetiro: async (id_bicicleta) => {
    const response = await api.put('/guards/retiro', { id_bicicleta });
    return response.data;
  },

  /**
   * @function registrarIngreso
   */
  registrarIngreso: async (data) => {
    const response = await api.post('/guards/ingreso', data);
    return response.data;
  },

  /**
   * @function getOwnerWithBicycles
   */
  getOwnerWithBicycles: async (rut) => {
    const response = await api.get(`/bicycles/owner-full/${rut}`);
    return response.data;
  },

  /**
   * @function getEstadisticas
   */
  getEstadisticas: async () => {
    const response = await api.get('/guards/estadisticas');
    return response.data;
  },
};