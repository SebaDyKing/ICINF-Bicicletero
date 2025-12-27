import { AppDataSource } from "../config/configDb.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { bicicleteroBodyPartialValidation } from "../validations/bicicletero.validations.js";
import { 
  getBicicleterosService,
  updateBicicleteroService,
  createBicicleteroService,
  deleteBicicleteroService,
  getBicicleterosStatusService 
} from "../service/bicicleRack.service.js"; 
import { actualizarDashboard } from "../service/webSocket.service.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";

/**
 * @function getBicicletero
 * @brief Obtiene la lista completa de bicicleteros registrados.
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
    console.error("Error al obtener bicicleteros:", error); // Mantenemos esto para que tú veas el error
    return handleErrorServer(res, 500, "Error del servidor al obtener bicicleteros", error.message);
  }
}

/**
 * @function updateBicicletero
 * @brief Actualiza parcialmente los datos de un bicicletero.
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
    
    // Notificamos cambios a la central
    if (req.io) actualizarDashboard(req.io);

  } catch (error) {
    console.error("Error al actualizar bicicletero:", error);
    return handleErrorServer(res, 500, "Error del servidor al actualizar", error.message);
  }
}

/**
 * @function createBicicletero
 * @brief Crea un nuevo registro de bicicletero (Ubicación).
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
      capacidad_maxima: newBicicletero.capacidad_maxima
    });

    if (req.io) actualizarDashboard(req.io);
    
  } catch (error) {
    console.error("Error al crear bicicletero:", error);
    return handleErrorServer(res, 500, "Error del servidor al crear bicicletero", error.message);
  }
}

/**
 * @function deleteBicicletero
 * @brief Elimina un bicicletero del sistema.
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

    if (req.io) actualizarDashboard(req.io);

  } catch (error) {
    console.error("Error al eliminar bicicletero:", error);
    return handleErrorServer(res, 500, "Error del servidor al eliminar", error.message);
  }
}

/**
 * @function getBicicleterosStatus
 * @brief Obtiene el estado de ocupación (Lleno/Disponible).
 */
export async function getBicicleterosStatus(req, res) {
  try {
    const bicicleteros = await getBicicleterosStatusService();

    const dataProcesada = bicicleteros.map(b => ({
        ...b,
        status: b.occupied >= b.total ? 'Lleno' : 'Disponible'
    }));

    handleSuccess(res, 200, "Estado obtenido exitosamente", dataProcesada);

  } catch (error) {
    console.error("Error status bicicleteros:", error);
    handleErrorServer(res, 500, "Error obteniendo estado de bicicleteros", error.message);
  }
}

export const getBicicleteros = async (req, res) => {
  try {
    const bicicleteroRepo = AppDataSource.getRepository(BicycleRack);
    // Busca todos los registros
    const bicicleteros = await bicicleteroRepo.find(); 
    return handleSuccess(res, 200, 'Success', bicicleteros)
  } catch (error) {
    return handleErrorServer(res, 500, 'Error.', error.message)
  }
};