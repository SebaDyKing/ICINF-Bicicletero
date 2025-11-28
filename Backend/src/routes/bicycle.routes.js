"use strict";
import { Router } from "express";
import { createBicycle, getBicyclesByOwner } from "../controllers/bicycle.controller.js";
import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// Crear bicicleta (Puede hacerlo un Owner, un Guardia o la Central)
router.post(
  "/create",
  authMiddleware,
  autorizeEntities("guardia", "Owner", "Central"), 
  createBicycle
);

// Ver bicicletas de un rut específico
router.get(
  "/owner/:rut",
  authMiddleware,
  autorizeEntities("guardia", "Owner", "Central"),
  getBicyclesByOwner
);

export default router;