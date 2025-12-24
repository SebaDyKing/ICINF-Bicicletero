import api from "../../../config/axios.config.js";

export const loginService = async (rut, password) => {
  try {
    const response = await api.post(`/auth/login`, {
      rut: rut,
      contrasenia: password,
    });

    const { data } = response.data;
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (error) {
    // Manejo de errores para leer el mensaje que envía el backend
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error desconocido");
    }
    throw new Error("Error de conexión con el servidor");
  }
};

export const logoutService = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const registerOwnerService = async (userData) => {
  try {
    const response = await api.post(`/owners/createOwner`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

export const verifyAccountService = async (email, codigo) => {
  try {
    const response = await api.post(`/auth/authenticate`, { email, codigo });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};
