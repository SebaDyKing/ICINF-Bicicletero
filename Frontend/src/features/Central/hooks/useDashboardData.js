import { useState, useEffect } from 'react';
import { useSocket } from '../../../hooks/useSocket.js';

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