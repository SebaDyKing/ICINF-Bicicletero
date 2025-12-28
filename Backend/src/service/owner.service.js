import { AppDataSource } from "../config/configDb.js"; 
import { BicycleRack } from "../models/bicycleRack.entity.js"; 
import { DentroBicicletero } from "../utils/CalcularDistancia.js"; 
import { v4 } from 'uuid';

/**
 * @function solicitarGuardService
 * @brief Lógica de negocio para generar una solicitud de asistencia presencial.
 *
 * Este servicio valida que el usuario se encuentre físicamente en un bicicletero antes
 * de notificar a los guardias. Es el núcleo de la funcionalidad de "Solicitar Guardia".
 *
 * Funcionalidades clave:
 * 1. **Validación Geoespacial:** Obtiene todos los bicicleteros y verifica matemáticamente
 * si las coordenadas (lat, lon) del usuario están dentro de un radio de 20 metros de alguno.
 * 2. **Identificación Única:** Genera un ID (UUID) para la solicitud, permitiendo que luego
 * pueda ser referenciada (ej: aceptada por un guardia específico).
 * 3. **Notificación en Tiempo Real:** Si la validación pasa, emite un evento global vía Socket.IO
 * para que todos los guardias conectados reciban la alerta instantáneamente.
 *
 * @param {number} lat Latitud actual del usuario.
 * @param {number} lon Longitud actual del usuario.
 * @param {import("socket.io").Server} io Instancia del servidor de WebSockets para emitir alertas.
 * @returns {Promise<Object>} Objeto con mensaje de éxito y datos del bicicletero detectado.
 * @throws {Error} Si faltan coordenadas o si el usuario no está en un rango válido (20m).
 */
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

  const solicitudId = v4();

  //  Emitir evento Socket
  if (io) {
    io.emit("nueva_solicitud_guardia", {
      id: solicitudId,
      message: "Se requiere asistencia en un bicicletero.",
      bicicletarioID: bicicletarioCercano.id_bicicletero,
      bicicletarioNombre: bicicletarioCercano.nombre,
      ubicacion: { lat, lon }
    });
  }

  return {
    message: "Solicitud enviada correctamente.",
    bicicletario: {
      id: bicicletarioCercano.id_bicicletero,
      nombre: bicicletarioCercano.nombre,
    },
  };
};