"use strict";
import { Router } from "express";
import {
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos,
  getCapacidadesBicicleteros,
  getEstadisticas
} from "../controllers/guard.controller.js";

import {
  createOwner,
  getAllOwners,
  getOwner,
  updateOwner,
  deleteOwner
} from "../controllers/owner.controller.js";

import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para la gestión de ingresos y retiros
router.post(
  "/ingreso",
  authMiddleware,
  autorizeEntities("guardia"),
  registrarIngreso
);

router.put(
  "/retiro",
  authMiddleware,
  autorizeEntities("guardia"),
  registrarRetiro
);

router.get(
  "/activos",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  getRegistrosActivos
);

router.get(
  "/capacidades",
  authMiddleware,
  autorizeEntities("guardia", "Owner", "Central"), 
  getCapacidadesBicicleteros
);

router.get(
  "/estadisticas",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  getEstadisticas
);

// Rutas para la gestión de propietarios
router.post(
  "/owner/create", 
  authMiddleware,
  autorizeEntities("guardia", "Central"), 
  createOwner
);

router.get(
  "/owner/get",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  getOwner
);

router.get(
  "/owner/getAll",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  getAllOwners
);

router.put(
  "/owner/update",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  updateOwner
);

router.delete(
  "/owner/delete",
  authMiddleware,
  autorizeEntities("guardia", "Central"),
  deleteOwner
);

export default router;