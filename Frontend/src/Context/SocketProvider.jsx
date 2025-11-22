import { createContext, useEffect } from "react";
import { socket } from "../services/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
