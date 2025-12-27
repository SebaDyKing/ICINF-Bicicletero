"use strict";
import { Router } from "express";
import { 
  createBicycle, 
  deleteBicycleByOwner, 
  getBicyclesByOwner 
} from "../controllers/bicycle.controller.js";
import { 
  authMiddleware, 
  autorizeEntities 
} from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/bicycles/create
 * @brief Registra una nueva bicicleta en el sistema.
 * @access Protegido (Guardia, Dueño, Central)
 */
router.post(
  "/create",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"), 
  createBicycle
);

/**
 * @route GET /api/bicycles/owner/:rut
 * @brief Obtiene todas las bicicletas asociadas a un RUT específico.
 * @access Protegido (Guardia, Dueño, Central)
 */
router.get(
  "/owner/:rut",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getBicyclesByOwner
);

/**
 * @route DELETE /api/bicycles/delete/:id_bicicleta
 * @brief Elimina una bicicleta específica por su ID.
 * @access Protegido (Guardia, Dueño, Central)
 */
router.delete(
  "/delete/:id_bicicleta",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  deleteBicycleByOwner
);

export default router;