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
  // Validación
  const { error } = validateIngresoBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    // Llamamos al servicio para registrar el ingreso
    const datosIngreso = {
      ...req.body,
      rut_guardia: req.user.rut // Descomenté esto para obtener el rut del guardia desde el token
    };
    const nuevoIngreso = await registrarIngresoService(datosIngreso);

    // El servicio devuelve 'null' si la bici ya está adentro
    if (!nuevoIngreso) {
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
  // Validación
  const { error } = validateRetiroBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    const { id_bicicleta } = req.body;
    
    // Llamamos al servicio
    const registro = await registrarRetiroService(id_bicicleta);

    // El servicio devuelve 'null' si no encontró la bici
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
    // Llamamos al servicio
    const registrosActivos = await getRegistrosActivosService();
    
    // Respondemos
    handleSuccess(res, 200, "Registros activos obtenidos.", registrosActivos);

  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener registros activos.", error.message);
}
};

export const getCapacidadesBicicleteros = async (req, res) => {
  try {
    // Llamamos al servicio
    const resultadoFinal = await getCapacidadesBicicleterosService();
    
    // Respondemos
    handleSuccess(res, 200, "Capacidades obtenidas.", resultadoFinal);

  } catch (error) {
    handleErrorServer(res, 500, "Error al calcular las capacidades.", error.message);
}
};