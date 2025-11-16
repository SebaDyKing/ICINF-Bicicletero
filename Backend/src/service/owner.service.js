import { AppDataSource } from "../config/configDb";
import { BicycleRack } from "../models/bicycleRack.entity";
import {calcularDistancia,DentroBicicletero} from "../utils/CalcularDistancia.js";
import {io} from "../index.js";

export const solicitarGuardService = async (lat,lon) => {
    if(!lat || !lon){
        throw new Error("Latitud y longitud son requeridos");
    }

    const bicicletario = await AppDataSource.getRepository(BicycleRack).find();

    const Radio = 50
    const distancia = calcularDistancia(lat,lon,bicicletario.latitud,bicicletario.longitud);

    const resultado = DentroBicicletero(lat,lon,bicicletario, Radio);

    if(!resultado.dentro){
        throw new Error("No hay bicicletarios cercanos");
    }

    const bicicletarioCercano = resultado.bicicletario;
    io.to("guardias").emit("nueva_solicitud_guardia", { 
     message: "Se ha solicitado un guardia en el bicicletario cercano",
     bicicletarioID: bicicletarioCercano.id,
     bicicletarioNombre: bicicletarioCercano.nombre
    });

    return {
        status : 200,
        payload : {
            message: "Solicitud de guardia enviada exitosamente",
            bicicletario: {
                id: bicicletarioCercano.id_bicicletero,
                nombre: bicicletarioCercano.nombre,
   }
  }
 }
}