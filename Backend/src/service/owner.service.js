import { AppDataSource } from "../config/configDb.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import { calcularDistancia } from "../utils/CalcularDistancia.js";

export const solicitarGuardService = async (lat, lon) => {
  if (!lat || !lon) {
    throw new Error("Latitud y longitud son requeridos");
  }

 
  const bicicletarios = await AppDataSource.getRepository(BicycleRack).find();

  const RADIO = 50;  
  const resultado = calcularDistancia(lat, lon, bicicletarios, RADIO);

  if (!resultado.dentro) {
    throw new Error("No hay bicicletarios cercanos");
  }

  const bicicletarioCercano = resultado.bicicletario;


  io.to("guardias").emit("nueva_solicitud_guardia", { 
    message: "Se ha solicitado un guardia en el bicicletario cercano",
    bicicletarioID: bicicletarioCercano.id_bicicletero,
    bicicletarioNombre: bicicletarioCercano.nombre
  });


  return {
    status: 200,
    payload: {
      message: "Solicitud de guardia enviada exitosamente",
      bicicletario: {
        id: bicicletarioCercano.id_bicicletero,
        nombre: bicicletarioCercano.nombre
      }
    }
  };
};
