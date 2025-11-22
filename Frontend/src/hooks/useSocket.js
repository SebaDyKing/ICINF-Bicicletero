import { useContext } from "react";
import { SocketProvider } from "../Context/SocketProvider";

export const useSocket = () => {
    return useContext(SocketProvider);
};
