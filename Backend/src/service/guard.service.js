"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { IsNull } from "typeorm";

/**
 * @brief Servicio para registrar un nuevo ingreso.
 * Contiene la lógica de negocio para validar y crear el registro.
 */
export const registrarIngresoService = async (datosIngreso) => {
  const { rut_owner, id_bicicleta, id_bicicletero } = datosIngreso;
  const storeRepository = AppDataSource.getRepository(Store);

  // Validamos que la bici no esté ya adentro
  const registroActivo = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  // Si encontramos un registro activo, devolvemos 'null' para que el controlador sepa que falló.
  if (registroActivo) {
    return null; 
  }

  // Creamos y guardamos el nuevo registro
  const nuevoIngreso = storeRepository.create({
    owner: { rut: rut_owner },
    bicycle: { id_bicicleta: id_bicicleta },
    bicycleRack: { id_bicicletero: id_bicicletero },
    // rut_guardia: req.user.rut, 
    tipoMovimiento: "Ingreso",
  });

  return await storeRepository.save(nuevoIngreso);
};

/**
 * @brief Servicio para registrar un retiro.
 * Busca el registro activo y le asigna la fecha de salida.
 */
export const registrarRetiroService = async (id_bicicleta) => {
  const storeRepository = AppDataSource.getRepository(Store);

  // Buscamos el registro activo
  const registro = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  // Si no hay registro, devolvemos 'null'
  if (!registro) {
    return null;
  }

  // Actualizamos el registro
  registro.fechaSalida = new Date();
  registro.tipoMovimiento = "Salida";

  return await storeRepository.save(registro);
};

/**
 * @brief Servicio para obtener todos los registros activos (bicis adentro).
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
 * @brief Servicio para calcular las capacidades de todos los bicicleteros.
 */
export const getCapacidadesBicicleterosService = async () => {
  const rackRepository = AppDataSource.getRepository(BicycleRack);

    // Consulta para obtener capacidades y ocupación actual
  const capacidades = await rackRepository.createQueryBuilder("rack")
    .select("rack.id_bicicletero", "id")
    .addSelect("rack.nombre", "nombre")
    .addSelect("rack.capacidad_maxima", "maxima")
    .leftJoin("rack.stores", "store", "store.fechaSalida IS NULL")
    .addSelect("COUNT(store.idRegistro)", "ocupados")
    .groupBy("rack.id_bicicletero")
    .getRawMany();

  // Mapeamos los resultados para devolver en el formato deseado
  const resultadoFinal = capacidades.map(rack => ({
    id: rack.id,
    nombre: rack.nombre,
    capacidadMaxima: rack.maxima,
    capacidadActual: parseInt(rack.ocupados, 10) 
  }));

  return resultadoFinal;
};