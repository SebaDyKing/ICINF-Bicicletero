import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext"; 

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};