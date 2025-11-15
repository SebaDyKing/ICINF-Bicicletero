import {AppDataSource} from "../config/configDb.js"
import { BicycleRack } from "../models/bicycleRack.entity.js";

/**
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
        "capacidad_maxima",
        "imagen"
      ],
    });

    return bicicleteros;
  } catch (error) {
    throw new Error(`Error al obtener bicicleteros: ${error.message}`);
  }
}

/**
 * @brief Actualiza los datos de un bicicletero existente.
 * @param {string} id  ID del bicicletero a actualizar.
 * @param {Partial<BicycleRack>} data  Datos validados para actualizar.
 * @returns {Promise<BicycleRack|null>} Bicicletero actualizado o null si no se encuentra.
 */
export async function updateBicicleteroService(id, data) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);

    const bicicletero = await bicicleteroRepository.findOneBy({ id_bicicletero: id });

    if (!bicicletero) {
      return null;
    }

    // Asignamos los datos actualizados
    Object.assign(bicicletero, data);

    return await bicicleteroRepository.save(bicicletero);
  } catch (error) {
    throw new Error(`Error al actualizar bicicletero: ${error.message}`);
  }
}

/**
 * @brief Crea un nuevo bicicletero en la base de datos.
 * @param {Partial<BicycleRack>} data  Datos del bicicletero a crear.
 * @returns {Promise<BicycleRack>} Bicicletero creado y almacenado.
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
 * @brief Elimina un bicicletero por su ID.
 * @param {string} id  ID del bicicletero a eliminar.
 * @returns {Promise<import("typeorm").DeleteResult>} Resultado de la operación (incluye el campo `affected`).
 */
export async function deleteBicicleteroService(id) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);

    return await bicicleteroRepository.delete({ id_bicicletero: id });
  } catch (error) {
    throw new Error(`Error al eliminar bicicletero: ${error.message}`);
  }
}
