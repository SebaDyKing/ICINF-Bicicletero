"use strict";
import { IsNull } from "typeorm";
import { AppDataSource } from "../config/configDb.js";
import { Bicycle } from "../models/bicycle.entity.js";
import { Owner } from "../models/owner.entity.js";
import { Store } from "../models/store.entity.js";

/**
 * @brief Servicio para registrar una nueva bicicleta en el sistema.
 *
 * Este servicio valida primero la existencia del dueño mediante su RUT. Luego, verifica
 * que el dueño no tenga ya registrada una bicicleta con el mismo alias (para garantizar
 * nombres únicos por usuario). Si las validaciones pasan, crea y guarda la nueva entidad.
 *
 * @param {Object} data Objeto con los datos de la bici (alias, color, marca, modelo, tipo, rut_duenio).
 * @returns {Promise<Object|null|string>} Retorna el objeto de la bicicleta creada, `null` si el dueño no existe, o "EXISTS" si el alias ya está en uso.
 */
export const createBicycleService = async (data) => {
  const bicycleRepository = AppDataSource.getRepository(Bicycle);
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Verificar que el dueño exista
  const owner = await ownerRepository.findOneBy({ rut: data.rut_duenio });
  if (!owner) return null;

  const exist = await bicycleRepository.findOne({
    where: {
      alias: data.alias,
      owner: { rut: data.rut_duenio },
    },
  });

  if (exist) return "EXISTS";

  // Crear la bicicleta (TypeORM maneja la relación automáticamente)
  const newBicycle = bicycleRepository.create({
    alias: data.alias,
    color: data.color,
    modelo: data.modelo,
    marca: data.marca,
    tipo: data.tipo,
    owner: owner,
  });

  return await bicycleRepository.save(newBicycle);
};

/**
 * @brief Servicio para obtener las bicicletas de un dueño y su estado actual.
 *
 * Este servicio realiza una consulta a la base de datos filtrando por el RUT del dueño
 * e incluyendo la relación con el historial de movimientos ('stores').
 * Posteriormente, procesa cada bicicleta para determinar dinámicamente la propiedad
 * "isParked" (verificando si existe un ingreso sin fecha de salida) y limpia el objeto
 * eliminando el historial crudo antes de retornarlo.
 *
 * @param {string} rut RUT del dueño de las bicicletas.
 * @returns {Promise<Array>} Retorna una promesa con el arreglo de bicicletas procesadas y su estado.
 */
export const getBicyclesByOwnerService = async (rut) => {
  const bicycleRepository = AppDataSource.getRepository(Bicycle);

  const bicycles = await bicycleRepository.find({
    where: { owner: { rut: rut } },
    relations: ["stores"],
    order: { fecha_creacion: "ASC" },
  });

  return bicycles.map((bike) => {
    const isParked = bike.stores && bike.stores.some((store) => store.fechaSalida === null);
    const { stores, ...bikeData } = bike;
    return {
      ...bikeData,
      isParked: isParked,
    };
  });
};

/**
 * @brief Servicio para eliminar una bicicleta.
 *
 * Este servicio verifica primero si la bicicleta se encuentra actualmente estacionada
 * (tiene un registro de ingreso sin salida en la tabla 'store'). Si está estacionada,
 * impide la eliminación retornando "PARKED". De lo contrario, procede a eliminar
 * el registro de la bicicleta de la base de datos.
 *
 * @param {number} id_bicicleta ID único de la bicicleta a eliminar.
 * @returns {Promise<Object|string>} Retorna el resultado de la eliminación o el string "PARKED" si no es posible borrarla.
 */
export const deleteBicycleService = async (id_bicicleta) => {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicycle);
    const storeRepository = AppDataSource.getRepository(Store);

    const isParked = await storeRepository.findOne({
      where: {
        bicycle: { id_bicicleta: id_bicicleta },
        fechaSalida: IsNull(),
      },
    });

    if (isParked) {
      return "PARKED";
    }

    return await bicycleRepository.delete({ id_bicicleta });
  } catch (error) {
    throw new Error(`Error al eliminar bicicleta: ${error.message}`);
  }
};

/**
 * @brief Servicio ESPECÍFICO para el ingreso del guardia.
 * @description Retorna al dueño completo CON sus bicicletas anidadas.
 */
export const getOwnerWithBicyclesService = async (rut) => {
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