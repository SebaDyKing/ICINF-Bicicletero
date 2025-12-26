"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js"; 
import { IsNull, Between } from "typeorm";

/**
 * @function registrarIngresoService
 * @brief Procesa la lógica de negocio para ingresar una bicicleta.
 * @details Verifica la capacidad real del bicicletero y evita ingresos duplicados.
 * @param {object} datosIngreso - Objeto con rut_owner, id_bicicleta, id_bicicletero, rut_guardia.
 * @returns {Promise<Store>} El registro de ingreso creado.
 * @throws {Error} Si el bicicletero no existe o está lleno.
 */
export const registrarIngresoService = async (datosIngreso) => {
  const { rut_owner, id_bicicleta, id_bicicletero, rut_guardia } = datosIngreso;
  const storeRepository = AppDataSource.getRepository(Store);
  const rackRepository = AppDataSource.getRepository(BicycleRack);

  // Obtener capacidad del bicicletero
  const rack = await rackRepository.findOneBy({ id_bicicletero: id_bicicletero });
  if (!rack) throw new Error("El bicicletero seleccionado no existe.");

  // Contamos cuántas bicicletas están dentro (fechaSalida es NULL)
  const ocupados = await storeRepository.countBy({
      bicycleRack: { id_bicicletero: id_bicicletero },
      fechaSalida: IsNull()
  });

  if (ocupados >= rack.capacidad_maxima) {
      throw new Error(`El bicicletero está LLENO (${ocupados}/${rack.capacidad_maxima}).`);
  }

  // Verificar si la bici ya está dentro (Evitar duplicados)
  const registroActivo = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  if (registroActivo) return null; // Ya está ingresada

  // Crear ingreso
  const nuevoIngreso = storeRepository.create({
    owner: { rut: rut_owner },
    bicycle: { id_bicicleta: id_bicicleta },
    bicycleRack: { id_bicicletero: id_bicicletero },
    guard: { rut: rut_guardia }, 
    tipoMovimiento: "Ingreso",
  });

  return await storeRepository.save(nuevoIngreso);
};

/**
 * @function registrarRetiroService
 * @brief Procesa la salida de una bicicleta.
 * @description Cierra el registro activo asignando una fecha de salida.
 * @param {number} id_bicicleta - ID de la bicicleta a retirar.
 * @returns {Promise<Store|null>} El registro actualizado o null si no estaba dentro.
 */
export const registrarRetiroService = async (id_bicicleta) => {
  const storeRepository = AppDataSource.getRepository(Store);

  // Buscamos el registro activo usando el ID de la bicicleta
  const registro = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  if (!registro) {
    return null;
  }

  // Cerramos el ciclo
  registro.fechaSalida = new Date();
  registro.tipoMovimiento = "Salida";

  return await storeRepository.save(registro);
};

/**
 * @function getRegistrosActivosService
 * @brief Obtiene todas las bicicletas que están actualmente dentro del recinto.
 * @returns {Promise<Store[]>} Lista de registros con relaciones cargadas.
 */
export const getRegistrosActivosService = async () => {
  const storeRepository = AppDataSource.getRepository(Store);
  
  const registrosActivos = await storeRepository.find({
    where: { fechaSalida: IsNull() },
    relations: {
      bicycle: { owner: true },
      bicycleRack: true,
      guard: true
    }
  });
  
  return registrosActivos;
};

/**
 * @function getCapacidadesBicicleterosService
 * @brief Calcula la ocupación actual de cada bicicletero.
 * @details Utiliza QueryBuilder para agrupar y contar registros activos eficientemente.
 */
export const getCapacidadesBicicleterosService = async () => {
  const rackRepository = AppDataSource.getRepository(BicycleRack);

  const capacidades = await rackRepository.createQueryBuilder("rack")
    .select("rack.id_bicicletero", "id")
    .addSelect("rack.nombre", "nombre")
    .addSelect("rack.capacidad_maxima", "maxima")
    .leftJoin("rack.stores", "store", "store.fechaSalida IS NULL")
    .addSelect("COUNT(store.id_registro)", "ocupados")
    .groupBy("rack.id_bicicletero")
    .addGroupBy("rack.nombre")
    .addGroupBy("rack.capacidad_maxima")
    .getRawMany();

  // Mapeamos para asegurar que los números sean enteros y la estructura limpia
  const resultadoFinal = capacidades.map(rack => ({
    id: rack.id,
    nombre: rack.nombre,
    capacidadMaxima: rack.maxima,
    capacidadActual: parseInt(rack.ocupados, 10) 
  }));

  return resultadoFinal;
};

/**
 * @function getEstadisticasService
 * @brief Obtiene métricas simples de movimientos del día actual.
 * @returns {Promise<Object>} Objeto con conteo de ingresos y retiros de hoy.
 */
export const getEstadisticasService = async () => {
  const storeRepository = AppDataSource.getRepository(Store);
  
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const ingresosHoy = await storeRepository.count({
    where: { fechaIngreso: Between(startOfDay, endOfDay) }
  });

  const retirosHoy = await storeRepository.count({
    where: { fechaSalida: Between(startOfDay, endOfDay) }
  });

  return { ingresosHoy, retirosHoy };
};