"use strict";
import { Router } from "express";
import { createBicycle, deleteBicycleByOwner, getBicyclesByOwner } from "../controllers/bicycle.controller.js";
import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router();

// Crear bicicleta (Puede hacerlo un Owner, un Guardia o la Central)
router.post(
  "/create",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"), 
  createBicycle
);

// Ver bicicletas de un rut específico
router.get(
  "/owner",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getBicyclesByOwner
);

router.delete(
  "/delete/:id_bicicleta",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  deleteBicycleByOwner
)

export default router;