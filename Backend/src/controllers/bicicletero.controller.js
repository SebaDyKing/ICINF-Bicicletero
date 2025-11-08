import { AppDataSource } from "../../../../Ayudantias-ISW/Backend/src/config/configDb";
import { handleSuccess,handleErrorClient,handleErrorServer } from "../../../../Ayudantias-ISW/Backend/src/Handlers/responseHandlers";
import { bicycleRack } from "../entities/bicicletero.entity.js";

export async function getBicicletero(req, res) {
  try {
    const bicicleteroRepository = AppDataSource.getRepository(bicycleRack);

    const bicicleteros = await bicicleteroRepository.find({
      select: ["id", "name", "Latitud", "Longitud", "CapacidadMaxima","imageURL"],
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

export async function deleteBicicletero(req, res) {

  try {
    const bicicleteroRepository = AppDataSource.getRepository(bicycleRack);

    const resultado = await bicicleteroRepository.delete(req.params.id);

    if(resultado.affected === 0){
      return handleErrorClient(res, 404, "Bicicletero no encontrado o ya eliminado");
    }
    handleSuccess(res, 200, "Bicicletero eliminado exitosamente", {
      message: `El bicicletero con ID ${req.params.id} ha sido eliminado.`,
    })

  }catch(error){
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
}