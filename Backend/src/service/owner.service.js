import { AppDataSource } from "../config/configDb.js"; // Ajusta la ruta a tu configDb
import { BicycleRack } from "../models/bicycleRack.entity.js"; // Ajusta a tu entidad
import { DentroBicicletero } from "../utils/CalcularDistancia.js"; // Asumo que tienes esta utilidad

export const solicitarGuardService = async (lat, lon, io) => {
  if (!lat || !lon) {
    throw new Error("Latitud y longitud son requeridos");
  }

  // Obtener bicicleteros
  const bicicletarios = await AppDataSource.getRepository(BicycleRack).find();

  // Calcular cercanía 
  const RADIO = 20; 
  const resultado = DentroBicicletero(lat, lon, bicicletarios, RADIO);

  if (!resultado.dentro) {
    throw new Error("No hay bicicleros cercanos. Debes estar a menos de 20m.");
  }

  const bicicletarioCercano = resultado.bicicletario;

  console.log(bicicletarioCercano)

  //  Emitir evento Socket
  if (io) {
    io.emit("nueva_solicitud_guardia", {
      message: "Se requiere asistencia en un bicicletero.",
      bicicletarioID: bicicletarioCercano.id_bicicletero,
      bicicletarioNombre: bicicletarioCercano.nombre,
      ubicacion: { lat, lon }
    });
  } else {
    console.warn("Socket.io no está disponible en el req.");
  }

  return {
    message: "Solicitud enviada correctamente. Un guardia ha sido notificado.",
    bicicletario: {
      id: bicicletarioCercano.id_bicicletero,
      nombre: bicicletarioCercano.nombre,
    },
  };
};