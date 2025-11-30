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
  autorizeEntities("Guard"),
  registrarIngreso
);

router.put(
  "/retiro",
  authMiddleware,
  autorizeEntities("Guard"),
  registrarRetiro
);

router.get(
  "/activos",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getRegistrosActivos
);

router.get(
  "/capacidades",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"), 
  getCapacidadesBicicleteros
);

router.get(
  "/estadisticas",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getEstadisticas
);

// Rutas para la gestión de propietarios
router.post(
  "/owner/create", 
  authMiddleware,
  autorizeEntities("Guard", "Central"), 
  createOwner
);

router.get(
  "/owner/get",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getOwner
);

router.get(
  "/owner/getAll",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  getAllOwners
);

router.put(
  "/owner/update",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  updateOwner
);

router.delete(
  "/owner/delete",
  authMiddleware,
  autorizeEntities("Guard", "Central"),
  deleteOwner
);

export default router;