"use strict";
import { createBicycleService, getBicyclesByOwnerService } from "../service/bicycle.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { validateBicycleBody } from "../validations/bicycle.validations.js";

/**
 * @brief Controlador para registrar una nueva bicicleta en el sistema.
 * @details Valida los datos del cuerpo de la solicitud, verifica que el dueño exista
 * y que no exista ya una bicicleta con el mismo ID antes de proceder a la creación.
 * * @param {import("express").Request} req Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export const createBicycle = async (req, res) => {
  const { error } = validateBicycleBody(req.body);
  if (error) {
    const validationErrors = error.details.map(detail => detail.message);
    return handleErrorClient(res, 400, "Error de validación", validationErrors);
  }

  try {
    const newBicycle = await createBicycleService(req.body);

    // Manejo de errores específicos del servicio
    if (newBicycle === null) return handleErrorClient(res, 404, "El dueño indicado no existe.");
    if (newBicycle === "EXISTS") return handleErrorClient(res, 409, "Ya existe una bicicleta con ese ID.");

    handleSuccess(res, 201, "Bicicleta creada exitosamente.", newBicycle);

  } catch (error) {
    handleErrorServer(res, 500, "Error al crear bicicleta.", error.message);
  }
};

/**
 * @brief Obtiene todas las bicicletas asociadas a un dueño específico.
 * @details Busca al dueño por su RUT y retorna su información junto con la lista 
 * de bicicletas que tiene registradas.
 * * @param {import("express").Request} req Objeto de solicitud HTTP (contiene el rut en params).
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export const getBicyclesByOwner = async (req, res) => {
  try {
    const { rut } = req.params;
    
    const ownerData = await getBicyclesByOwnerService(rut);
    
    if (!ownerData) {
      return handleErrorClient(res, 404, "Dueño no encontrado.");
    }

    handleSuccess(res, 200, "Dueño y bicicletas obtenidos.", ownerData);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener bicicletas.", error.message);
  }
};