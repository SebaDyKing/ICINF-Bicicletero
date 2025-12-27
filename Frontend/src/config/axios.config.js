import axios from "axios";

/**
 * @file axios.config.js
 * @brief Configuración global del cliente HTTP (Axios).
 *
 * Este archivo crea una instancia centralizada de Axios para toda la aplicación.
 * Sus principales funciones son:
 * 1. Definir la URL base de la API (para no repetirla en cada servicio).
 * 2. Configurar interceptores para inyectar automáticamente el token de autenticación (JWT)
 * en los encabezados de cada petición saliente.
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

/**
 * @brief Interceptor de Solicitudes (Request Interceptor).
 *
 * Se ejecuta ANTES de que cualquier petición salga hacia el backend.
 * Su objetivo es buscar el token JWT en el almacenamiento local y adjuntarlo
 * en el header `Authorization`. Esto evita tener que enviar el token manualmente
 * en cada servicio.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;