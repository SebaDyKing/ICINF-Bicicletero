"use strict";
import {
  createBicycleService,
  deleteBicycleService,
  getBicyclesByOwnerService,
} from "../service/bicycle.service.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../Handlers/responseHandlers.js";
import { validateBicycleBody } from "../validations/bicycle.validations.js";

/**
 * @function createBicycle
 * @brief Controlador para registrar una nueva bicicleta.
 * @description Valida los datos y asocia la bicicleta a un dueño existente.
 * @param {import("express").Request} req - Body con datos de la bici y rut del dueño.
 * @param {import("express").Response} res - Respuesta con la bicicleta creada.
 */
export const createBicycle = async (req, res) => {
  const { error } = validateBicycleBody(req.body);

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);
    return handleErrorClient(res, 400, "Error de validación", validationErrors);
  }

  try {
    const newBicycle = await createBicycleService(req.body);

    if (newBicycle === null) {
      return handleErrorClient(res, 404, "El dueño indicado no existe.");
    if (newBicycle === "EXISTS")
      return handleErrorClient(
        res,
        409,
        "Ya existe una bicicleta con ese alias."
      );

    handleSuccess(res, 201, "Bicicleta creada exitosamente.", {
      ...newBicycle,
      mensaje: `Se ha generado el código ${newBicycle.alias}`,
    });
  } catch (error) {
    console.error("Error al crear bicicleta:", error);
    handleErrorServer(res, 500, "Error al crear bicicleta.", error.message);
  }
};

/**
 * @function getBicyclesByOwner
 * @brief Obtiene todas las bicicletas asociadas a un dueño específico.
 * @param {import("express").Request} req - RUT del dueño en los parámetros de la URL.
 * @param {import("express").Response} res - Lista de bicicletas.
 */
export const getBicyclesByOwner = async (req, res) => {
  try {
    const { rut } = req.params; 

    if (!rut) {
        return handleErrorClient(res, 400, "El RUT del dueño es obligatorio.");
    }

    const bicycles = await getBicyclesByOwnerService(rut);

    if (bicycles === null) {
      return handleErrorClient(res, 404, "Dueño no encontrado.");
    }

    handleSuccess(res, 200, "Bicicletas obtenidas exitosamente.", bicycles);
  } catch (error) {
    console.error("Error al obtener bicicletas:", error);
    handleErrorServer(res, 500, "Error al obtener bicicletas.", error.message);
  }
};

/**
 * @function deleteBicycleByOwner
 * @brief Elimina una bicicleta específica.
 * @param {import("express").Request} req - ID de la bicicleta en los parámetros.
 * @param {import("express").Response} res - Confirmación de eliminación.
 */
export const deleteBicycleByOwner = async (req, res) => {
  try {
    const { id_bicicleta } = req.params;
    const result = await deleteBicycleService(id_bicicleta);

    if (result === "PARKED") {
      return handleErrorClient(
        res,
        404,
        "No se puede eliminar la bicicleta porque se encuentra actualmente estacionada en la universidad."
      );
    }

    if (result.affected === 0) {
      return handleErrorClient(res, 404, "Bicicleta no encontrada");
    }

    handleSuccess(res, 200, "Bicicleta eliminada exitosamente");
  } catch (error) {
    console.error("Error al eliminar bicicleta:", error);
    handleErrorServer(res, 500, "Error al eliminar bicicleta.", error.message);
  }
};