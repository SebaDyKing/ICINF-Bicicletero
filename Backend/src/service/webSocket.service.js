import { getDashboardData } from "./dashboard.service.js";

export const actualizarDashboard = async (io) => {
    try {

        const payload = await getDashboardData();

        io.emit('dashboard:actualizacion', payload);

    } catch (error) {
        console.error("WebSocket Error:", error);
    }
};