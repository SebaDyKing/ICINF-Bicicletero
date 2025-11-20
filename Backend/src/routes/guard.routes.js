// src/routes/guard.routes.js
"use strict";
import { Router } from "express";
import {
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos,
  getCapacidadesBicicleteros
} from "../controllers/guard.controller.js";

import { createReport, deleteReport, updateReport, getReport, getAllReports } from "../controllers/reports.controller.js";

import reportRoutes from '../routes/reports.routes.js'

// import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";
// import { validateSchema } from "../middlewares/validate.middleware.js";
// import { ... } from "../validations/store.validation.js";



const router = Router();

// --- Rutas de Ingreso/Retiro  ---

// POST /api/guards/ingreso
router.post(
  "/ingreso",
  // authMiddleware,
  // autorizeEntities("guard"),
  // validateSchema(ingresoSchema),
  registrarIngreso
);

// PUT /api/guards/retiro
// (Usamos PUT porque estamos ACTUALIZANDO un registro existente)
router.put(
  "/retiro",
  // authMiddleware,
  // autorizeEntities("guard"),
  // validateSchema(retiroSchema),
  registrarRetiro
);

// --- Rutas de Consulta  ---

// GET /api/guards/activos
router.get(
  "/activos",
  // authMiddleware,
  // autorizeEntities("guard", "central"),
  getRegistrosActivos
);

// GET /api/guards/capacidades
router.get(
  "/capacidades",
  // authMiddleware,
  // autorizeEntities("guard", "owner", "central"), 
  getCapacidadesBicicleteros
);

//Con esto puede utilizar las rutas de reportes
router.use(reportRoutes)

export default router;