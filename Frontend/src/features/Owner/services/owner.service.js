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

export const getBicyclesByRut = async (rut) => {
  try {
    const response = await api.get(`/bicycles/owner/${rut}`);
    return response.data.data;
  } catch (error) {
    console.error("Error obteniendo bicicletas:", error);
    return null;
  }
};

/**
 * Nueva función para obtener el historial real desde el Backend.
 */
export const getOwnerHistory = async (rut) => {
  try {
    const response = await api.get(`/owners/history/${rut}`);
    return response.data.data || []; 
  } catch (error) {
    console.error("Error obteniendo historial:", error);
    return [];
  }
};

/**
 * Obtiene la ocupación real de los bicicleteros.
 */
export const getBicicleterosStatus = async () => {
  try {
    const response = await api.get('/bicicleteros/status');
    return response.data.data || [];
  } catch (error) {
    console.error("Error cargando status bicicleteros:", error);
    return []; 
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