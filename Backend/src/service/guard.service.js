"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js"; 
import { IsNull, Between } from "typeorm";

/**
 * @brief Registra el ingreso de una bicicleta al recinto.
 * @details Realiza validaciones de lógica de negocio críticas:
 * 1. Verifica la capacidad actual del bicicletero mediante una consulta SQL directa.
 * Si está lleno, lanza una excepción para detener el proceso.
 * 2. Verifica que la bicicleta no tenga ya un ingreso activo (sin fecha de salida).
 * * @param {Object} datosIngreso Objeto con rut_owner, id_bicicleta, id_bicicletero, rut_guardia.
 * @returns {Promise<Store|null>} Retorna la entidad creada o null si la bicicleta ya estaba adentro.
 * @throws {Error} Si el bicicletero ha alcanzado su capacidad máxima.
 */
export const registrarIngresoService = async (datosIngreso) => {
  const { rut_owner, id_bicicleta, id_bicicletero, rut_guardia } = datosIngreso;
  const storeRepository = AppDataSource.getRepository(Store);

  // ================= VALIDACIÓN DE CAPACIDAD =================
  // Consultamos cuántas bicicletas hay activas (sin salida) en este bicicletero específico.
  const queryCapacidad = `
    SELECT 
      br.capacidad_maxima,
      (SELECT COUNT(*) FROM store s WHERE s.id_bicicletero = $1 AND s.fecha_salida IS NULL)::int as ocupados
    FROM "bicycleRack" br
    WHERE br.id_bicicletero = $1
  `;

  // Consultamos directo a la BD para obtener el conteo real
  const resultadoCheck = await AppDataSource.query(queryCapacidad, [id_bicicletero]);
  
  if (resultadoCheck.length > 0) {
      const { capacidad_maxima, ocupados } = resultadoCheck[0];
      
      // SI ESTÁ LLENO -> RECHAZAMOS LA PROMESA (El controller capturará este error)
      if (ocupados >= capacidad_maxima) {
          throw new Error(`El bicicletero está LLENO (${ocupados}/${capacidad_maxima}). No se puede ingresar.`);
      }
  }
  // =================================================================

  // Verificamos si ya existe un registro activo para esta bicicleta
  const registroActivo = await storeRepository.findOne({
    where: {
      bicycle: { id_bicicleta: id_bicicleta },
      fechaSalida: IsNull()
    }
  });

  if (registroActivo) {
    return null; // La bicicleta ya está dentro
  }

  // Creamos el nuevo registro de ingreso
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
 * @brief Registra la salida (retiro) de una bicicleta.
 * @details Busca el registro activo (fechaSalida IS NULL) correspondiente a la bicicleta
 * y cierra el ciclo actualizando la fecha de salida y el tipo de movimiento.
 * * @param {number} id_bicicleta ID de la bicicleta que se retira.
 * @returns {Promise<Store|null>} Retorna el registro actualizado o null si no había ingreso activo.
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
 * @brief Obtiene todos los registros activos (bicicletas dentro del recinto).
 * @details Realiza un Join con las tablas de Dueño, Bicicleta, Bicicletero y Guardia
 * para mostrar información completa en el dashboard.
 * * @returns {Promise<Store[]>} Lista de registros activos.
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
 * @brief Calcula la ocupación actual de cada bicicletero.
 * @details Utiliza QueryBuilder para agrupar por bicicletero y contar cuántos registros 
 * en la tabla 'store' no tienen fecha de salida.
 * * @returns {Promise<Object[]>} Array con id, nombre, capacidad máxima y capacidad actual.
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

  // Formateamos los números que vienen como string desde la consulta raw
  const resultadoFinal = capacidades.map(rack => ({
    id: rack.id,
    nombre: rack.nombre,
    capacidadMaxima: rack.maxima,
    capacidadActual: parseInt(rack.ocupados, 10) 
  }));

  return resultadoFinal;
};

/**
 * @brief Obtiene estadísticas de movimientos del día actual.
 * @details Cuenta cuántos ingresos y cuántos retiros se han realizado entre las 00:00 y las 23:59 de hoy.
 * * @returns {Promise<Object>} Objeto con { ingresosHoy, retirosHoy }.
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