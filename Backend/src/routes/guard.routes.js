"use strict";
import { Router } from "express";

import {
  getOwners,
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos
} from "../controllers/guard.controller.js";

import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Rutas para "Owners" ---
router.get(
  "/owners",
  // authMiddleware,
  // autorizeEntities("guard", "central"),
  getOwners
);

// --- Rutas para "Ingresos/Retiros" ---
router.post(
  "/ingreso",
  // authMiddleware,
  // autorizeEntities("guard"),
  registrarIngreso
);
router.post(
  "/retiro",
  // authMiddleware,
  // autorizeEntities("guard"),
  registrarRetiro
);
router.get(
  "/activos",
  // authMiddleware,
  // autorizeEntities("guard", "central"),
  getRegistrosActivos
);

export default router;