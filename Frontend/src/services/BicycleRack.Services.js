import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const getBicicletero = async () => {
  try {
    const response = await axios.get(`${API_URL}/bicicleteros`);
    return response.data;
  } catch (error) {
    console.error('Error en el servicio al obtener bicicleteros:', error);
    throw error;
  }
};