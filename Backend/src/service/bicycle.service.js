"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Bicycle } from "../models/bicycle.entity.js";
import { Owner } from "../models/owner.entity.js";

/**
 * @function createBicycleService
 * @brief Crea una nueva bicicleta y la asocia a un dueño existente.
 * @details Genera un alias automático (ej: BIC-001) contando las bicicletas previas del dueño.
 * @param {object} data - Objeto con datos de la bici y rut_duenio.
 * @returns {Promise<Bicycle|null>} La bicicleta creada o null si el dueño no existe.
 */
export const createBicycleService = async (data) => {
  const bicycleRepository = AppDataSource.getRepository(Bicycle);
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Verificar que el dueño exista
  const owner = await ownerRepository.findOneBy({ rut: data.rut_duenio });
  if (!owner) return null;

  // Contar cuántas bicis tiene para generar el siguiente alias
  const count = await bicycleRepository.countBy({
    owner: { rut: data.rut_duenio },
  });

  const nextAliasNumber = count + 1;
  const alias = `BIC-${String(nextAliasNumber).padStart(3, "0")}`;

  // Crear la bicicleta (TypeORM maneja la relación automáticamente)
  const newBicycle = bicycleRepository.create({
    alias: alias,
    color: data.color,
    modelo: data.modelo,
    marca: data.marca,
    tipo: data.tipo,
    owner: owner,
  });

  return await bicycleRepository.save(newBicycle);
};

/**
 * @function getBicyclesByOwnerService
 * @brief Busca un dueño y retorna su información junto con sus bicicletas.
 * @param {string} rut - RUT del dueño a buscar.
 * @returns {Promise<Owner|null>} Objeto Owner con relación 'bicycles' cargada.
 */
export const getBicyclesByOwnerService = async (rut) => {
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Buscamos al Dueño y pedimos explícitamente la relación "bicycles"
  const owner = await ownerRepository.findOne({
    where: { rut: rut },
    relations: ["bicycles"],
  });

  if (!owner) {
    return null;
  }

  return owner;
};

/**
 * @function deleteBicycleService
 * @brief Elimina una bicicleta de la base de datos por su ID.
 * @param {number} id_bicicleta - ID de la bicicleta a eliminar.
 */
export const deleteBicycleService = async (id_bicicleta) => {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicycle);
    return await bicycleRepository.delete({ id_bicicleta });
  } catch (error) {
    throw new Error(`Error al eliminar bicicleta: ${error.message}`);
  }
};