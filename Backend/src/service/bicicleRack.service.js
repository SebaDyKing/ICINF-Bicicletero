import { AppDataSource } from "../config/configDb.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";

/**
 * @function getBicicleterosService
 * @brief Obtiene la lista completa de bicicleteros desde la base de datos.
 * @returns {Promise<BicycleRack[]>} Lista de bicicleteros con sus campos principales.
 */
export async function getBicicleterosService() {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);

    const bicicleteros = await bicicleteroRepository.find({
      select: [
        "id_bicicletero",
        "nombre",
        "latitud",
        "longitud",
        "capacidad_maxima"
      ],
    });

    return bicicleteros;
  } catch (error) {
    throw new Error(`Error al obtener bicicleteros: ${error.message}`);
  }
}

/**
 * @function updateBicicleteroService
 * @brief Actualiza los datos de un bicicletero existente.
 * @param {number} id - ID del bicicletero.
 * @param {object} data - Datos parciales a actualizar.
 */
export async function updateBicicleteroService(id, data) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);
    const bicicletero = await bicicleteroRepository.findOneBy({ id_bicicletero: id });

    if (!bicicletero) return null;

    Object.assign(bicicletero, data);
    return await bicicleteroRepository.save(bicicletero);
  } catch (error) {
    throw new Error(`Error al actualizar bicicletero: ${error.message}`);
  }
}

/**
 * @function createBicicleteroService
 * @brief Crea un nuevo bicicletero en la base de datos.
 * @param {object} data - Datos del nuevo bicicletero.
 */
export async function createBicicleteroService(data) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);
    const newBicicletero = bicicleteroRepository.create(data);
    return await bicicleteroRepository.save(newBicicletero);
  } catch (error) {
    throw new Error(`Error al crear bicicletero: ${error.message}`);
  }
}

/**
 * @function deleteBicicleteroService
 * @brief Elimina un bicicletero por su ID.
 * @param {number} id - ID del bicicletero a eliminar.
 */
export async function deleteBicicleteroService(id) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);
    return await bicicleteroRepository.delete({ id_bicicletero: id });
  } catch (error) {
    throw new Error(`Error al eliminar bicicletero: ${error.message}`);
  }
}

/**
 * @function getBicicleterosStatusService
 * @brief Obtiene el estado de ocupación de cada bicicletero.
 * @details Utiliza una consulta SQL nativa (Raw Query) a través del EntityManager 
 * para garantizar la correcta relación de tablas y evitar errores de ORM.
 */
export async function getBicicleterosStatusService() {
    try {
        const query = `
          SELECT 
            br.id_bicicletero, 
            br.nombre, 
            br.capacidad_maxima as total,
            (
              SELECT COUNT(*) 
              FROM store s 
              WHERE s.id_bicicletero = br.id_bicicletero 
              AND s.fecha_salida IS NULL
            )::int as occupied
          FROM "bicycleRack" br
        `;
        
        return await AppDataSource.manager.query(query);
    } catch (error) {
        throw new Error(`Error obteniendo status: ${error.message}`);
    }
}