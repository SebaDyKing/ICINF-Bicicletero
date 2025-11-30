import { useContext } from "react";
import { SocketContext } from "../Context/SocketContext";

export const useSocket = () => {
    return useContext(SocketContext);
};