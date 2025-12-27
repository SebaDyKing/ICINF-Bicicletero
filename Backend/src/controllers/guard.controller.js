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

/**
 * @function registrarIngreso
 * @brief Controlador para registrar el ingreso de una bicicleta al recinto.
 * @description Valida los datos, asocia el ingreso al guardia autenticado y notifica vía WebSocket.
 * @param {import("express").Request} req - Body con rut_owner, id_bicicleta, id_bicicletero. User contiene rut_guardia.
 * @param {import("express").Response} res - Respuesta con el objeto creado.
 */
export const registrarIngreso = async (req, res) => {
  const { error } = validateIngresoBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    const datosIngreso = {
      ...req.body,
      rut_guardia: req.user.rut // Se obtiene del token del guardia logueado
    };
    const nuevoIngreso = await registrarIngresoService(datosIngreso);
    
    if (!nuevoIngreso) {
      return handleErrorClient(res, 400, "Esta bicicleta ya se encuentra registrada como 'Ingreso' activo.");
    }

    // Notificar cambio al dashboard en tiempo real
    if (req.io) { await actualizarDashboard(req.io); }

    handleSuccess(res, 201, "Ingreso registrado exitosamente.", nuevoIngreso);
  } catch (error) {
    console.error("Error al registrar ingreso:", error);
    handleErrorServer(res, 500, "Error al registrar el ingreso.", error.message);
  }
};

/**
 * @function registrarRetiro
 * @brief Controlador para registrar el retiro (salida) de una bicicleta.
 * @details Incluye conversión de tipo para asegurar compatibilidad con el validador Joi.
 * @param {import("express").Request} req - Body con id_bicicleta.
 * @param {import("express").Response} res - Objeto actualizado.
 */
export const registrarRetiro = async (req, res) => {
  if (req.body.id_bicicleta) {
      req.body.id_bicicleta = parseInt(req.body.id_bicicleta);
  }

  const { error } = validateRetiroBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error en los datos de entrada.", validationErrors);
  }

  try {
    const { id_bicicleta } = req.body;
    const registro = await registrarRetiroService(id_bicicleta);
    
    if (!registro) {
      return handleErrorClient(res, 404, "No se encontró un ingreso activo para esta bicicleta.");
    }

    // Notificar cambio al dashboard en tiempo real
    if (req.io) { await actualizarDashboard(req.io); }

    handleSuccess(res, 200, "Retiro registrado exitosamente.", registro);
  } catch (error) {
    console.error("Error al registrar retiro:", error);
    handleErrorServer(res, 500, "Error al registrar el retiro.", error.message);
  }
};

/**
 * @function getRegistrosActivos
 * @brief Obtiene el listado de bicicletas actualmente dentro del recinto.
 */
export const getRegistrosActivos = async (req, res) => {
  try {
    const registrosActivos = await getRegistrosActivosService();
    handleSuccess(res, 200, "Registros activos obtenidos.", registrosActivos);
  } catch (error) {
    console.error("Error al obtener registros activos:", error);
    handleErrorServer(res, 500, "Error al obtener registros activos.", error.message);
  }
};

/**
 * @function getCapacidadesBicicleteros
 * @brief Obtiene la información de capacidad y ocupación de los bicicleteros.
 */
export const getCapacidadesBicicleteros = async (req, res) => {
  try {
    const resultadoFinal = await getCapacidadesBicicleterosService();
    handleSuccess(res, 200, "Capacidades obtenidas.", resultadoFinal);
  } catch (error) {
    console.error("Error al obtener capacidades:", error);
    handleErrorServer(res, 500, "Error al calcular las capacidades.", error.message);
  }
};

/**
 * @function getEstadisticas
 * @brief Obtiene estadísticas generales del día (Ingresos vs Retiros).
 */
export const getEstadisticas = async (req, res) => {
  try {
    const stats = await getEstadisticasService();
    handleSuccess(res, 200, "Estadísticas obtenidas.", stats);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    handleErrorServer(res, 500, "Error al obtener estadísticas.", error.message);
  }
};