"use strict";
import { AppDataSource } from "../config/configDb.js";
import { handleErrorClient } from "../Handlers/responseHandlers.js";
import { Bicycle } from "../models/bicycle.entity.js";
import { Owner } from "../models/owner.entity.js";

export const createBicycleService = async (data) => {
  const bicycleRepository = AppDataSource.getRepository(Bicycle);
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Verificar que el dueño exista
  const owner = await ownerRepository.findOneBy({ rut: data.rut_duenio });
  if (!owner) return null;

  const count = await bicycleRepository.countBy({
    owner: { rut: data.rut_duenio },
  });

  const nextAliasNumber = count + 1;
  const alias = `BIC-${String(nextAliasNumber).padStart(3, "0")}`;

  // Crear la bicicleta
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

export const getBicyclesByOwnerService = async (rut) => {
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Buscamos al Dueño y pedimos que traiga sus bicicletas
  const owner = await ownerRepository.findOne({
    where: { rut: rut },
    relations: ["bicycles"],
  });

  return owner.bicycles;
};

export const deleteBicycleService = async (id_bicicleta) => {
  try {
    const bicycleRepository = AppDataSource.getRepository(Bicycle);
    return await bicycleRepository.delete({ id_bicicleta });
  } catch (error) {
    throw new Error(`Error al eliminar bicicleta: ${error.message}`);
  }
};
