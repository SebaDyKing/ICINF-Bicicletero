import { AppDataSource } from "../config/configDb.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { bicicleteroBodyPartialValidation } from "../validations/bicicletero.validations.js";

/**
 * @brief Obtiene todos los bicicleteros almacenados en la base de datos.
 * 
 * Esta función consulta el repositorio de bicicleteros y retorna una lista con los datos
 * principales de cada uno. Si no se encuentran registros, devuelve un mensaje de error 404.
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP de Express.
 * @param {import("express").Response} res - Objeto de respuesta HTTP de Express.
 * @return {Promise<void>} Envía una respuesta JSON con la lista de bicicleteros o un mensaje de error.
 */
export async function getBicicletero(req, res) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);

    const bicicleteros = await bicicleteroRepository.find({
      select: ["id_bicicletero", "nombre", "latitud", "longitud", "capacidad_maxima","imagen"],
    });

    if(bicicleteros.length === 0){
      return handleErrorClient(res, 404, "No se encontraron bicicleteros");
    }

    handleSuccess(res, 200, "Bicicleteros obtenidos exitosamente", {
      total: bicicleteros.length,
      bicicleteros
    });
}catch(error){
    return handleErrorServer(res, 500, "Error del servidor", error.message);
}
}


/**
 * @brief Actualiza parcialmente los datos de un bicicletero existente.
 * 
 * Esta función permite modificar los campos de un bicicletero identificado por su ID,
 * validando primero los datos recibidos. Si el bicicletero no existe o los datos son inválidos,
 * devuelve una respuesta de error correspondiente.
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP de Express.
 * @param {import("express").Response} res - Objeto de respuesta HTTP de Express.
 * @return {Promise<void>} Envía una respuesta JSON con los datos actualizados o un mensaje de error.
 */
export async function updateBicicletero(req, res) {
  try {
    const {error,value} = bicicleteroBodyPartialValidation(req.body);

    if(error){
      const errorMessages = error.details.map((detail) => detail.message);
      return handleErrorClient(res, 400, "Error de validación", errorMessages);
    }

    const bicicleteroId = req.params.id;
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);

    const bicicletero = await bicicleteroRepository.findOneBy({id_bicicletero: bicicleteroId});
    if(!bicicletero){
      return handleErrorClient(res, 404, "Bicicletero no encontrado");
    }
    Object.assign(bicicletero, value);

    await bicicleteroRepository.save(bicicletero);
    handleSuccess(res, 200, "Bicicletero actualizado exitosamente", {
      id: bicicletero.id,
      name: bicicletero.name,
      Latitud: bicicletero.Latitud,
      Longitud: bicicletero.Longitud,
      CapacidadMaxima: bicicletero.CapacidadMaxima,
    });

  }catch(error){
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}


/**
 * @brief Crea un nuevo bicicletero en la base de datos.
 * 
 * Esta función recibe los datos del bicicletero desde el cuerpo de la solicitud (`req.body`),
 * valida la información (si corresponde), y luego la guarda en la base de datos mediante el repositorio.
 * Finalmente, retorna un mensaje de éxito con los datos del bicicletero creado.
 *
 * @param {import("express").Request} req - Objeto de solicitud HTTP de Express, que debe incluir en el cuerpo:
 *   @param {string} req.body.name - Nombre del bicicletero.
 *   @param {number} req.body.Latitud - Coordenada de latitud.
 *   @param {number} req.body.Longitud - Coordenada de longitud.
 *   @param {number} req.body.CapacidadMaxima - Número máximo de bicicletas que puede albergar.
 *   @param {string} [req.body.imageURL] - URL de la imagen representativa del bicicletero.
 * 
 * @param {import("express").Response} res - Objeto de respuesta HTTP de Express.
 * 
 * @return {Promise<void>} Envía una respuesta JSON con los datos del bicicletero creado
 * o un mensaje de error si ocurre algún problema en el servidor.
 */
export async function createBicicletero(req, res) {
  const {error} = bicicleteroBodyPartialValidation(req.body);

  if(error){
    const errorMessages = error.details.map((detail) => detail.message);
    return handleErrorClient(res, 400, "Error de validación", errorMessages);
  }
  
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);
    const { nombre, latitud, longitud, capacidad_maxima,} = req.body;

    const newBicicletero = bicicleteroRepository.create({
      nombre,
      latitud,
      longitud,
      capacidad_maxima,
      imagen,
    })

    await bicicleteroRepository.save(newBicicletero);

      handleSuccess(res, 201, "Bicicletero creado exitosamente", {
      id_bicicletero: newBicicletero.id_bicicletero,
      nombre: newBicicletero.nombre,
      latitud: newBicicletero.latitud,
      longitud: newBicicletero.longitud,
      capacidad_maxima: newBicicletero.capacidad_maxima,
      imagen: newBicicletero.imagen,
      })
  }catch(error){
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}

export async function deleteBicicletero(req, res) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(BicycleRack);
    const {id} = req.params;
    
    const resultado = await bicicleteroRepository.delete({ id_bicicletero: id });

    if(resultado.affected === 0){
      return handleErrorClient(res, 404, "Bicicletero no encontrado o ya eliminado");
    }
    handleSuccess(res, 200, "Bicicletero eliminado exitosamente", {
      message: `El bicicletero con ID ${id} ha sido eliminado.`,
    })

  }catch(error){
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}