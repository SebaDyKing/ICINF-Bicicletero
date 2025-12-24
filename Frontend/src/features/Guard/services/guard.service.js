import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const guardService = {
  getRegistrosActivos: async () => {
    const response = await axios.get(`${API_URL}/guards/activos`, getAuthHeaders());
    return response.data;
  },

  getCapacidades: async () => {
    const response = await axios.get(`${API_URL}/guards/capacidades`, getAuthHeaders());
    return response.data;
  },

  getBicicleteros: async () => {
    const response = await axios.get(`${API_URL}/bicicleteros`, getAuthHeaders());
    return response.data;
  },

  registrarRetiro: async (id_bicicleta) => {
    const response = await axios.put(
      `${API_URL}/guards/retiro`, 
      { id_bicicleta }, 
      getAuthHeaders()
    );
    return response.data;
  },

  registrarIngreso: async (data) => {
    const response = await axios.post(
      `${API_URL}/guards/ingreso`, 
      data, 
      getAuthHeaders()
    );
    return response.data;
  },

  getOwnerByRut: async (rut) => {
    const response = await axios.get(`${API_URL}/bicycles/owner/${rut}`, getAuthHeaders());
    return response.data;
  },

  getEstadisticas: async () => {
    const response = await axios.get(`${API_URL}/guards/estadisticas`, getAuthHeaders());
    return response.data;
  },
};