import express from "express";
import {
  getBicicletero,
  createBicicletero,
  updateBicicletero,
  deleteBicicletero,
} from "../controllers/bicicletero.controller.js";

const router = express.Router();

/**
 * Rutas CRUD para bicicleteros
 * Base: /api/bicicleteros
 */

// Obtener todos los bicicleteros
router.get("/", getBicicletero);

// Crear un nuevo bicicletero
router.post("/", createBicicletero);

// Actualizar parcialmente un bicicletero por ID
router.patch("/:id", updateBicicletero);

// Eliminar un bicicletero por ID
router.delete("/:id", deleteBicicletero);

export default router;
