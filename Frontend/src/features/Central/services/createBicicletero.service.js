import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Crea un nuevo bicicletero en la base de datos.
 * @param {Object} formData - Datos crudos del formulario
 * @returns {Promise} - Respuesta del servidor
 */
export async  function createBicicletero (formData) {
  const payload = {
    nombre: formData.nombre.trim(),
    capacidad_maxima: Number(formData.capacidad_maxima),
    latitud: Number(formData.latitud),
    longitud: Number(formData.longitud)
  };

  if (formData.imagen && formData.imagen.trim() !== "") {
    payload.imagen = formData.imagen.trim();
  }

  const response = await axios.post(`${API_BASE_URL}/bicicleteros/create`, payload);
  
  return response.data;
};