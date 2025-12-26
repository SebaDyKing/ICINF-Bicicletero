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

export const createBicycle = async (req, res) => {
  const { error } = validateBicycleBody(req.body);

  if (error) {
    const validationErrors = error.details.map((detail) => detail.message);
    return handleErrorClient(res, 400, "Error de validación", validationErrors);
  }

  try {
    const newBicycle = await createBicycleService(req.body);

    if (newBicycle === null)
      return handleErrorClient(res, 404, "El dueño indicado no existe.");
    if (newBicycle === "EXISTS")
      return handleErrorClient(res, 409, "Ya existe una bicicleta con ese ID.");

    handleSuccess(res, 201, "Bicicleta creada exitosamente.", {
      ...newBicycle,
      mensaje: `Se ha generado el código ${newBicycle.alias}`, // Feedback visual útil
    });
  } catch (error) {
    handleErrorServer(res, 500, "Error al crear bicicleta.", error.message);
  }
};

export const getBicyclesByOwner = async (req, res) => {
  try {
    const { rut } = req.query;

    const ownerData = await getBicyclesByOwnerService(rut);

    if (!ownerData) {
      return handleErrorClient(res, 404, "Dueño no encontrado.");
    }

    handleSuccess(res, 200, "Dueño y bicicletas obtenidos.", ownerData);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener bicicletas.", error.message);
  }
};

export const deleteBicycleByOwner = async (req, res) => {
  try {
    const { id_bicicleta } = req.params;
    console.log(id_bicicleta)
    const result = await deleteBicycleService(id_bicicleta);

    if (result.affected === 0) {
      return handleErrorClient(res, 404, "Bicicleta no encontrada");
    }

    handleSuccess(res, 200, "Bicicleta eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar bicicleta.", error.message);
  }
};
