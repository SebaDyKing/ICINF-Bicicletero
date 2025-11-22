// src/controllers/guard.controller.js
"use strict";

import { AppDataSource } from "../config/configDb.js";
import { Store } from "../models/store.entity.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { IsNull } from "typeorm";
import { validateIngresoBody, validateRetiroBody } from "../validations/store.validations.js";
import { actualizarDashboard } from "../service/webSocket.service.js";

// ================================
// --- Lógica de Ingreso/Retiro ---
// ================================

export const registrarIngreso = async (req, res) => {
  const { error } = validateIngresoBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    const { rut_owner, id_bicicleta, id_bicicletero } = req.body;
    const storeRepository = AppDataSource.getRepository(Store);

    // (Validación de Negocio: Revisar si la bici ya está adentro)
    const registroActivo = await storeRepository.findOne({
      where: {
        bicycle: { id_bicicleta: id_bicicleta },
        fechaSalida: IsNull() 
      }
    });
    if (registroActivo) {
      return handleErrorClient(res, 400, "Esta bicicleta ya se encuentra registrada como 'Ingreso' activo.");
    }

    // Crea el nuevo registro
    const nuevoIngreso = storeRepository.create({
      owner: { rut: rut_owner },
      bicycle: { id_bicicleta: id_bicicleta },
      bicycleRack: { id_bicicletero: id_bicicletero },
      tipoMovimiento: "Ingreso",
    });

    await storeRepository.save(nuevoIngreso);
    await actualizarDashboard(); 
    
    handleSuccess(res, 201, "Ingreso registrado exitosamente.", nuevoIngreso);

  } catch (error) {
    handleErrorServer(res, 500, "Error al registrar el ingreso.", error.message);
  }
};

export const registrarRetiro = async (req, res) => {
  const { error } = validateRetiroBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    const { id_bicicleta } = req.body;
    const storeRepository = AppDataSource.getRepository(Store);

    // 1. Buscar el registro de ingreso ACTIVO
    const registro = await storeRepository.findOne({
      where: {
        bicycle: { id_bicicleta: id_bicicleta },
        fechaSalida: IsNull()
      }
    });

    if (!registro) {
      return handleErrorClient(res, 404, "No se encontró un ingreso activo para esta bicicleta.");
    }

    // 2. Actualizar el registro
    registro.fechaSalida = new Date();
    registro.tipoMovimiento = "Salida";

    await storeRepository.save(registro);
    await actualizarDashboard(); 
    handleSuccess(res, 200, "Retiro registrado exitosamente.", registro);

  } catch (error) {
    handleErrorServer(res, 500, "Error al registrar el retiro.", error.message);
  }
};

export const getRegistrosActivos = async (req, res) => {
  try {
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
    handleSucess(res, 200, "Registros activos obtenidos.", registrosActivos);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener registros activos.", error.message);
  }
};

export const getCapacidadesBicicleteros = async (req, res) => {
  try {
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

    handleSucess(res, 200, "Capacidades obtenidas.", resultadoFinal);
  } catch (error) {
    handleErrorServer(res, 500, "Error al calcular las capacidades.", error.message);
  }
};