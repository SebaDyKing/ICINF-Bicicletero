import { getDashboardData } from "../service/dashboard.service.js";

/**
 * @function socketController
 * @brief Controlador principal para la gestión de eventos en tiempo real (WebSockets).
 *
 * Este módulo inicializa la conexión de Socket.IO y define los "listeners" (escuchadores)
 * para interactuar con los clientes (Frontend de Guardias y Dueños).
 * * Funcionalidades principales:
 * 1. **Carga Inicial:** Envía datos del dashboard apenas un cliente se conecta.
 * 2. **Actualización bajo demanda:** Permite al cliente pedir datos frescos manualmete.
 * 3. **Coordinación de Guardias:** Gestiona el flujo de aceptación de solicitudes, 
 * notificando a todos los conectados cuando un guardia toma una tarea.
 *
 * @param {import("socket.io").Server} io Instancia del servidor de Socket.IO para gestionar emisiones globales.
 */
export const socketController = (io) => {
  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    try {
      const initialData = await getDashboardData();
      socket.emit("dashboard:actualizacion", initialData);
    } catch (error) {
      console.error("Error al enviar datos iniciales socket:", error);
    }

    socket.on("dashboard:solicitar-datos", async () => {
      const data = await getDashboardData();
      socket.emit("dashboard:actualizacion", data);
    });

    socket.on("guardia_responde_solicitud", (data) => {
      const { solicitudId, accion, guardiaNombre, bicicleteroNombre } = data;

      if (accion === "aceptar") {
        io.emit("solicitud_tomada", {
          id: solicitudId,
          tomadaPor: guardiaNombre,
          bicicletero: bicicleteroNombre
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};
