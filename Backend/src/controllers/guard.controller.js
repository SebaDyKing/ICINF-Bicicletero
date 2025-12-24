// src/controllers/guard.controller.js
"use strict";

import { 
  handleSuccess, 
  handleErrorClient, 
  handleErrorServer 
} from "../Handlers/responseHandlers.js";

import { 
  validateIngresoBody, 
  validateRetiroBody 
} from "../validations/store.validations.js";

import { actualizarDashboard } from "../service/webSocket.service.js";

import {
  registrarIngresoService,
  registrarRetiroService,
  getRegistrosActivosService,
  getCapacidadesBicicleterosService,
  getEstadisticasService
} from "../service/guard.service.js"; 

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
    // Preparamos los datos
    const datosIngreso = {
      ...req.body,
      rut_guardia: req.user.rut // Obtenemos el rut del token
    };

    // 1. Llamamos al servicio (Él se encarga de guardar en la BD)
    const nuevoIngreso = await registrarIngresoService(datosIngreso);

    if (!nuevoIngreso) {
      return handleErrorClient(res, 400, "Esta bicicleta ya se encuentra registrada como 'Ingreso' activo.");
    }

    // 2. Notificamos a los sockets (Frontend) para que se actualice solo
    if (req.io) {
      await actualizarDashboard(req.io); 
    }
    
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
    
    // 1. Llamamos al servicio (Él busca, actualiza la fecha y guarda)
    const registro = await registrarRetiroService(id_bicicleta);

    if (!registro) {
      return handleErrorClient(res, 404, "No se encontró un ingreso activo para esta bicicleta.");
    }

    // 2. Notificamos a los sockets
    if (req.io) {
      await actualizarDashboard(req.io); 
    }

    handleSuccess(res, 200, "Retiro registrado exitosamente.", registro);

  } catch (error) {
    handleErrorServer(res, 500, "Error al registrar el retiro.", error.message);
  }
};

export const getRegistrosActivos = async (req, res) => {
  try {
    const registrosActivos = await getRegistrosActivosService();
    handleSuccess(res, 200, "Registros activos obtenidos.", registrosActivos);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener registros activos.", error.message);
  }
};

export const getCapacidadesBicicleteros = async (req, res) => {
  try {
    const resultadoFinal = await getCapacidadesBicicleterosService();
    handleSuccess(res, 200, "Capacidades obtenidas.", resultadoFinal);
  } catch (error) {
    handleErrorServer(res, 500, "Error al calcular las capacidades.", error.message);
  }
};

export const getEstadisticas = async (req, res) => {
  try {
    const stats = await getEstadisticasService();
    handleSuccess(res, 200, "Estadísticas obtenidas.", stats);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener estadísticas.", error.message);
  }
};