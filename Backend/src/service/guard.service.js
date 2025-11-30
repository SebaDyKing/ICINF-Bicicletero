"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { IsNull, Between } from "typeorm";

/**
 * @brief Servicio para registrar un nuevo ingreso.
 */
export const registrarIngresoService = async (datosIngreso) => {
  const { rut_owner, id_bicicleta, id_bicicletero, rut_guardia } = datosIngreso;
  const storeRepository = AppDataSource.getRepository(Store);

  // Validamos que la bici no esté ya adentro
  const registroActivo = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  if (registroActivo) {
    return null; 
  }

  // Creamos y guardamos el nuevo registro
  const nuevoIngreso = storeRepository.create({
    owner: { rut: rut_owner },
    bicycle: { id_bicicleta: id_bicicleta },
    bicycleRack: { id_bicicletero: id_bicicletero },
    guard: { rut: rut_guardia }, // Asociamos al guardia logueado
    tipoMovimiento: "Ingreso",
  });

  return await storeRepository.save(nuevoIngreso);
};

/**
 * @brief Servicio para registrar un retiro.
 */
export const registrarRetiroService = async (id_bicicleta) => {
  const storeRepository = AppDataSource.getRepository(Store);

  const registro = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  if (!registro) {
    return null;
  }

  registro.fechaSalida = new Date();
  registro.tipoMovimiento = "Salida";

  return await storeRepository.save(registro);
};

/**
 * @brief Servicio para obtener todos los registros activos.
 */
export const getRegistrosActivosService = async () => {
  const storeRepository = AppDataSource.getRepository(Store);
  
  const registrosActivos = await storeRepository.find({
    where: {
      fechaSalida: IsNull()
    },
    relations: {
      bicycle: {
        owner: true
      },
      bicycleRack: true,
      guard: true
    }
  });
  
  return registrosActivos;
};

/**
 * @brief Servicio para calcular las capacidades.
 */
export const getCapacidadesBicicleterosService = async () => {
  const rackRepository = AppDataSource.getRepository(BicycleRack);

  const capacidades = await rackRepository.createQueryBuilder("rack")
    .select("rack.id_bicicletero", "id")
    .addSelect("rack.nombre", "nombre")
    .addSelect("rack.capacidad_maxima", "maxima")
    .leftJoin("rack.stores", "store", "store.fechaSalida IS NULL")
    .addSelect("COUNT(store.idRegistro)", "ocupados")
    .groupBy("rack.id_bicicletero")
    .getRawMany();

  const resultadoFinal = capacidades.map(rack => ({
    id: rack.id,
    nombre: rack.nombre,
    capacidadMaxima: rack.maxima,
    capacidadActual: parseInt(rack.ocupados, 10) 
  }));

  return resultadoFinal;
};

/**
 * @brief Servicio para obtener estadísticas del día.
 */
export const getEstadisticasService = async () => {
  const storeRepository = AppDataSource.getRepository(Store);
  
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const ingresosHoy = await storeRepository.count({
    where: {
      fechaIngreso: Between(startOfDay, endOfDay)
    }
  });

  const retirosHoy = await storeRepository.count({
    where: {
      fechaSalida: Between(startOfDay, endOfDay)
    }
  });

  return { ingresosHoy, retirosHoy };
};