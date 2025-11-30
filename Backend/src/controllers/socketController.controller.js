import { getDashboardData } from "../service/dashboard.service.js";

export const socketController = (io) => {
  io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);
    
    try {
      const initialData = await getDashboardData();
      socket.emit("dashboard:actualizacion", initialData);
    } catch(error) {
      console.error("Error al enviar datos iniciales socket:", error);
    }
    
    socket.on("dashboard:solicitar-datos", async() => {
      const data = await getDashboardData();
      socket.emit("dashboard:actualizacion", data);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });
};