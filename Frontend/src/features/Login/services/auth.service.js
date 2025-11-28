import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const loginService = async (rut, password) => {
  try {
    // Enviamos 'rut' y 'contrasenia'
    const response = await axios.post(`${API_URL}/auth/login`, {
      rut: rut,
      contrasenia: password,
    });

    // backend devuelve: { status: "Success", data: { token, rut, email, tipo_usuario }, ... }
    const { data } = response.data; // Extraemos el objeto 'data' interno

    if (data.token) {
      localStorage.setItem("token", data.token);
      // Guardamos el usuario completo para tener el rol a mano
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (error) {
    // Manejo de errores para leer el mensaje que envía el backend (handleErrorClient)
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error desconocido");
    }
    throw new Error("Error de conexión con el servidor");
  }
};

export const registerOwnerService = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/owners/createOwner`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error de conexión" };
  }
};

// src/features/Login/services/auth.service.js

// ... (tus otras funciones login y register)

export const verifyAccountService = async (email, code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/authenticate`, { email, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error de conexión' };
  }
};




