"use strict";
import { Router } from "express";
import {
  registrarIngreso,
  registrarRetiro,
  getRegistrosActivos,
  getCapacidadesBicicleteros
} from "../controllers/guard.controller.js";

import {
  createOwner,
  getAllOwners,
  getOwner,
  updateOwner,
  deleteOwner,
} from "../controllers/owner.controller.js";

import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas para la gestión de ingresos y retiros
router.post(
  "/ingreso",
  authMiddleware,
  autorizeEntities("guard"),
  registrarIngreso
);

router.put(
  "/retiro",
  authMiddleware,
  autorizeEntities("guard"),
  registrarRetiro
);

router.get(
  "/activos",
  authMiddleware,
  autorizeEntities("guard", "central"),
  getRegistrosActivos
);

router.get(
  "/capacidades",
  authMiddleware,
  autorizeEntities("guard", "owner", "central"), 
  getCapacidadesBicicleteros
);

// Rutas para la gestión de propietarios
router.post(
  "/owner/create", 
  authMiddleware,
  autorizeEntities("guard", "central"), 
  createOwner
);

router.get(
  "/owner/get",
  authMiddleware,
  autorizeEntities("guard", "central"),
  getOwner
);

router.get(
  "/owner/getAll",
  authMiddleware,
  autorizeEntities("guard", "central"),
  getAllOwners
);

router.put(
  "/owner/update",
  authMiddleware,
  autorizeEntities("guard", "central"),
  updateOwner
);

router.delete(
  "/owner/delete",
  authMiddleware,
  autorizeEntities("guard", "central"),
  deleteOwner
);

export default router;