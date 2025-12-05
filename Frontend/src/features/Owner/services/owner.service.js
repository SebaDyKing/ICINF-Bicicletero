import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const getOwnerService = async (rut) => {
  try {
    const response = await axios.get(`${API_URL}/owners/getOwner`, {
      params: {rut}, 
    });
    return response.data.data

  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
