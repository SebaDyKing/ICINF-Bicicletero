import express from "express";
import {
  getBicicletero,
  createBicicletero,
  updateBicicletero,
  deleteBicicletero,
  getBicicleterosStatus
} from "../controllers/bicicletero.controller.js";

const router = express.Router();

/**
 * Rutas CRUD para bicicleteros
 * Base: /api/bicicleteros
 */

// Obtener todos los bicicleteros
router.get("/", getBicicletero);

// Crear un nuevo bicicletero
router.post("/create", createBicicletero);

// Actualizar parcialmente un bicicletero por ID
router.patch("/:id", updateBicicletero);

// Eliminar un bicicletero por ID
router.delete("/:id", deleteBicicletero);

// Obtener el estado de todos los bicicleteros
router.get("/status", getBicicleterosStatus);

export default router;
