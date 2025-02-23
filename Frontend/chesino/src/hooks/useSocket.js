import { useEffect } from "react";
import { useState } from "react";

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("Connected to server");
            setSocket(ws);
        };

        ws.onclose = () => {
            console.log("Disconnected from server");
            setSocket(null);
        };

       /* ws.close = () => {
            console.log("Disconnected from server");
            setSocket(null);
        };*/
    }, []);

    return socket;
}