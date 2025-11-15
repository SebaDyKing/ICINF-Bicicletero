import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { bicicleteroBodyPartialValidation } from "../validations/bicicletero.validations.js";
import { 
  getBicicleterosService,
  updateBicicleteroService,
  createBicicleteroService,
  deleteBicicleteroService
} from "../service/bicicleRack.service.js";

/**
 * @brief Controlador para obtener la lista completa de bicicleteros.
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function getBicicletero(req, res) {
  try {
    const bicicleteros = await getBicicleterosService();

    if (!bicicleteros || bicicleteros.length === 0) {
      return handleErrorClient(res, 404, "No se encontraron bicicleteros");
    }

    handleSuccess(res, 200, "Bicicleteros obtenidos exitosamente", {
      total: bicicleteros.length,
      bicicleteros
    });

  } catch (error) {
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}

/**
 * @brief Controlador para actualizar parcialmente un bicicletero existente.
 * @param {import("express").Request} req  Objeto de solicitud con datos a actualizar.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function updateBicicletero(req, res) {
  try {
    const { error, value } = bicicleteroBodyPartialValidation(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return handleErrorClient(res, 400, "Error de validación", errorMessages);
    }

    const bicicleteroId = req.params.id;

    const updatedBicicletero = await updateBicicleteroService(bicicleteroId, value);

    if (!updatedBicicletero) {
      return handleErrorClient(res, 404, "Bicicletero no encontrado");
    }

    handleSuccess(res, 200, "Bicicletero actualizado exitosamente", {
      id: updatedBicicletero.id_bicicletero,
      nombre: updatedBicicletero.nombre,
      latitud: updatedBicicletero.latitud,
      longitud: updatedBicicletero.longitud,
      capacidad_maxima: updatedBicicletero.capacidad_maxima,
    });

  } catch (error) {
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}

/**
 * @brief Controlador para crear un nuevo bicicletero.
 * @param {import("express").Request} req  Objeto de solicitud con los datos del nuevo bicicletero.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function createBicicletero(req, res) {
  try {
    const { error, value } = bicicleteroBodyPartialValidation(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return handleErrorClient(res, 400, "Error de validación", errorMessages);
    }

    const newBicicletero = await createBicicleteroService(value);

    handleSuccess(res, 201, "Bicicletero creado exitosamente", {
      id_bicicletero: newBicicletero.id_bicicletero,
      nombre: newBicicletero.nombre,
      latitud: newBicicletero.latitud,
      longitud: newBicicletero.longitud,
      capacidad_maxima: newBicicletero.capacidad_maxima,
      imagen: newBicicletero.imagen,
    });

  } catch (error) {
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}

/**
 * @brief Controlador para eliminar un bicicletero por su ID.
 * @param {import("express").Request} req  Objeto de solicitud que contiene el ID del bicicletero a eliminar.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function deleteBicicletero(req, res) {
  try {
    const { id } = req.params;

    const resultado = await deleteBicicleteroService(id);

    if (resultado.affected === 0) {
      return handleErrorClient(res, 404, "Bicicletero no encontrado o ya eliminado");
    }

    handleSuccess(res, 200, "Bicicletero eliminado exitosamente", {
      message: `El bicicletero con ID ${id} ha sido eliminado.`,
    });

  } catch (error) {
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}
