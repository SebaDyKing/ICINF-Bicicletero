import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * @async
 * @function createBicicletero
 * @description Crea un nuevo bicicletero en la base de datos.
 * @param {Object} formData - Datos del formulario para crear el bicicletero.
 * @param {string} formData.nombre - Nombre del bicicletero.
 * @param {number} formData.capacidad_maxima - Capacidad máxima de bicicletas.
 * @param {number} formData.latitud - Latitud de la ubicación del bicicletero.
 * @param {number} formData.longitud - Longitud de la ubicación del bicicletero.
 * @param {string} [formData.imagen] - URL o path de la imagen del bicicletero (opcional).
 * @returns {Promise<Object>} Datos del bicicletero creado.
 * @throws {Error} Error de axios si la solicitud falla.
 */
export async function createBicicletero(formData) {
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
}

/**
 * @async
 * @function deleteBicicletero
 * @description Elimina un bicicletero por su ID. También elimina todos los registros históricos asociados.
 * @param {string|number} id - ID del bicicletero a eliminar.
 * @returns {Promise<Object>} Confirmación de la eliminación.
 * @throws {Error} Error de axios si la solicitud falla.
 */
export const deleteBicicletero = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/bicicleteros/${id}`);
  return response.data;
};

/**
 * @async
 * @function updateBicicletero
 * @description Actualiza un bicicletero existente usando PATCH (actualización parcial).
 * @param {number|string} id - ID del bicicletero a actualizar.
 * @param {Object} formData - Datos del formulario con los campos a actualizar.
 * @param {string} formData.nombre - Nuevo nombre del bicicletero.
 * @param {number} formData.capacidad_maxima - Nueva capacidad máxima.
 * @param {number} formData.latitud - Nueva latitud.
 * @param {number} formData.longitud - Nueva longitud.
 * @param {string} [formData.imagen] - Nueva URL o path de la imagen (opcional).
 * @returns {Promise<Object>} Datos del bicicletero actualizado.
 * @throws {Error} Error de axios si la solicitud falla.
 */
export const updateBicicletero = async (id, formData) => {
  const payload = {
    nombre: formData.nombre.trim(),
    capacidad_maxima: Number(formData.capacidad_maxima),
    latitud: Number(formData.latitud),
    longitud: Number(formData.longitud)
  };

  if (formData.imagen && formData.imagen.trim() !== "") {
    payload.imagen = formData.imagen.trim();
  }

  const response = await axios.patch(`${API_BASE_URL}/bicicleteros/${id}`, payload);
  return response.data;
};