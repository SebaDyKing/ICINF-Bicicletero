"use strict";
import { Router } from "express";
import {
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos,
  getCapacidadesBicicleteros,
  getEstadisticas,
} from "../controllers/guard.controller.js";

// Importaciones necesarias para las utilidades extras (Dropdowns, reportes)
import { getBicicleteros } from "../controllers/bicicletero.controller.js";
import { getOwnersByBicicletero } from "../controllers/owner.controller.js";
import Report from './reports.routes.js'
import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// ==========================================
//        RUTAS UTILITARIAS / REPORTES
// ==========================================
router.use('/report', Report);

// Nota: Esta ruta suele usarse para llenar el "Select" de bicicleteros en el Frontend.
// Debería tener protección si no es pública.
router.get('/getBicicleteros', getBicicleteros); 
router.get('/getOwnersByBicicletero', getOwnersByBicicletero); 

// ==========================================
//          OPERACIONES DE GUARDIA
// ==========================================

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

export default router;