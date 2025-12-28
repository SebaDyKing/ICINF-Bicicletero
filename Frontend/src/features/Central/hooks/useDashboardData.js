import { useState, useEffect } from 'react';
import { useSocket } from '../../../hooks/useSocket.js';

/**
 * @hook useDashboardData
 * @description Hook personalizado que obtiene y mantiene sincronizados los datos del dashboard
 * en tiempo real mediante WebSocket. Gestiona KPIs, datos de bicicleteros, actividad reciente
 * y gráficos estadísticos.
 * @returns {Object} Datos del dashboard actualizados en tiempo real.
 * @returns {Object} returns.kpi - Indicadores clave de desempeño.
 * @returns {number} returns.kpi.totalBicicletas - Total de bicicletas actualmente en el sistema.
 * @returns {number} returns.kpi.capacidadTotal - Capacidad total de todos los bicicleteros.
 * @returns {number} returns.kpi.ocupacionGlobal - Porcentaje de ocupación global.
 * @returns {number} returns.kpi.ingresosHoy - Número de ingresos del día actual.
 * @returns {number} returns.kpi.salidasHoy - Número de salidas del día actual.
 * @returns {Array} returns.racks - Array de bicicleteros con su estado de ocupación.
 * @returns {Array} returns.actividad - Actividad reciente (últimos 5 movimientos).
 * @returns {Object} returns.graficos - Datos para gráficos.
 * @returns {Array} returns.graficos.porHora - Datos de ingresos por hora del día.
 * @returns {Array} returns.graficos.semanal - Datos de ingresos de la última semana.
 */
export const useDashboardData = () => {
    const [data, setData] = useState({
        kpi: {
            totalBicicletas: 0,
            capacidadTotal: 185,
            ocupacionGlobal: 0,
            ingresosHoy: 0,
            salidasHoy: 0,
        },
        racks: [],
        actividad: [],
        graficos: {
            porHora: [],
            semanal: []
        }
    });

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleUpdate = (newData) => {
            setData((prevData) => ({
                ...prevData,
                ...newData
            }));
        };

        socket.on('dashboard:actualizacion', handleUpdate);
        socket.emit('dashboard:solicitar-datos');

        return () => {
            socket.off('dashboard:actualizacion', handleUpdate);
        };
    }, [socket]);

    return data;
};