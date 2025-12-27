"use strict";
import { Router } from "express";
import {
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos,
  getCapacidadesBicicleteros,
  getEstadisticas,
} from "../controllers/guard.controller.js";

import {
  createOwner,
  getAllOwners,
  getOwner,
  updateOwner,
  deleteOwner
} from "../controllers/owner.controller.js";

import { getOwnersByBicicletero } from "../controllers/owner.controller.js";

import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

import Report from './reports.routes.js'
import { getBicicleteros } from "../controllers/bicicletero.controller.js";

const router = Router();

router.use('/report', Report)
router.get('/getOwnersByBicicletero', getOwnersByBicicletero)
router.get('/getBicicleteros', getBicicleteros)

/**
 * @route POST /api/guard/ingreso
 * @brief Registra la entrada de una bicicleta.
 * @access Guardia
 */
router.post(
  "/ingreso",
  authMiddleware,
  autorizeEntities("Guard"),
  registrarIngreso
);

/**
 * @route PUT /api/guard/retiro
 * @brief Registra la salida de una bicicleta.
 * @access Guardia
 */
router.put(
  "/retiro",
  authMiddleware,
  autorizeEntities("Guard"),
  registrarRetiro
);

/**
 * @route GET /api/guard/activos
 * @brief Obtiene el listado de bicicletas actualmente dentro del recinto.
 * @access Guardia, Central
 */
router.get(
  "/activos",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getRegistrosActivos
);

/**
 * @route GET /api/guard/capacidades
 * @brief Muestra la ocupación de los bicicleteros.
 * @access Guardia, Owner, Central
 */
router.get(
  "/capacidades",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"), 
  getCapacidadesBicicleteros
);

/**
 * @route GET /api/guard/estadisticas
 * @brief Obtiene métricas del día (Ingresos vs Retiros).
 * @access Guardia, Central
 */
router.get(
  "/estadisticas",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getEstadisticas
);

// ==========================================
//          GESTIÓN DE PROPIETARIOS
// ==========================================

/**
 * @route POST /api/guard/owner/create
 * @brief Crea un nuevo dueño en el sistema.
 * @access Guardia, Central
 */
router.post(
  "/owner/create", 
  authMiddleware,
  autorizeEntities("Guard", "Central"), 
  createOwner
);

/**
 * @route GET /api/guard/owner/get
 * @brief Busca un dueño específico.
 * @note Revisa si el controlador espera el RUT por query param (?rut=...) o body.
 * @access Guardia, Central
 */
router.get(
  "/owner/get",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getOwner
);

/**
 * @route GET /api/guard/owner/getAll
 * @brief Obtiene la lista de todos los dueños.
 * @access Guardia, Central
 */
router.get(
  "/owner/getAll",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getAllOwners
);

/**
 * @route PUT /api/guard/owner/update
 * @brief Actualiza datos de un dueño.
 * @access Guardia, Central
 */
router.put(
  "/owner/update",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  updateOwner
);

/**
 * @route DELETE /api/guard/owner/delete
 * @brief Elimina un dueño del sistema.
 * @access Guardia, Central
 */
router.delete(
  "/owner/delete",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  deleteOwner
);

export default router;