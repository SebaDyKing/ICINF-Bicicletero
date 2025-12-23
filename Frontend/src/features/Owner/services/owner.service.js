import api from "../../../config/axios.config.js";

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

export const updateOwnerService = async (ownerData) => {
  try {
    const response = await api.put(`/owners/updateOwner`, ownerData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};