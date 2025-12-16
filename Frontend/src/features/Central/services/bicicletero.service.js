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


/**
 * Elimina un bicicletero por su ID
 * @param {string|number} id - ID del bicicletero
 * @returns {Promise}
 */

export const deleteBicicletero = async (id) => {
  // 1. Ver qué ID está llegando
  console.log("Intentando borrar ID:", id); 
  
  // 2. Ver qué URL exacta se está construyendo
  const urlFinal = `${API_BASE_URL}/bicicleteros/${id}`;
  console.log("URL de eliminación:", urlFinal);

  try {
      const response = await axios.delete(urlFinal);
      return response.data;
  } catch (error) {
      // 3. Ver el error real si falla
      console.error("Error en axios:", error);
      throw error; // Lanzamos el error para que el componente lo capture y muestre el Toast rojo
  }
};