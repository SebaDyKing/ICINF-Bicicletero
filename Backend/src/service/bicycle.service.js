"use strict";
import { AppDataSource } from "../config/configDb.js";
import { Bicycle } from "../models/bicycle.entity.js";
import { Owner } from "../models/owner.entity.js";

export const createBicycleService = async (data) => {
  const bicycleRepository = AppDataSource.getRepository(Bicycle);
  const ownerRepository = AppDataSource.getRepository(Owner);

  // Verificar que el dueño exista
  const owner = await ownerRepository.findOneBy({ rut: data.rut_duenio });
  if (!owner) return null;

  // Verificar que la bicicleta no exista ya
  const existingBike = await bicycleRepository.findOneBy({ id_bicicleta: data.id_bicicleta });
  if (existingBike) return "EXISTS";

  // Crear la bicicleta
  const newBicycle = bicycleRepository.create({
    id_bicicleta: data.id_bicicleta,
    color: data.color,
    modelo: data.modelo,
    owner: { rut: data.rut_duenio }
  });

  return await bicycleRepository.save(newBicycle);
};

export const getBicyclesByOwnerService = async (rut) => {
  const ownerRepository = AppDataSource.getRepository(Owner);
  
  // Buscamos al Dueño y pedimos que traiga sus bicicletas
  const owner = await ownerRepository.findOne({
    where: { rut: rut },
    relations: ["bicycles"] 
  });

  return owner; // Devuelve el objeto Owner (con bicis) o null
};