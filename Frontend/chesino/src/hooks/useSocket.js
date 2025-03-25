import { useEffect } from "react";
import { useState } from "react";
import Ably from "ably";

const ABLY_API_KEY = "S1xC5g.dsEmMA:Dt6EoWhWM6BWo9YoXNEHYRai95V6QHrTlX1CSzWtBJo";
const CHANNEL_NAME = "chesino-game-frontend";

export const useSocket = () => {
    const [channel, setChannel] = useState(null);

    useEffect(() => {
        const ably = new Ably.Realtime({ key: ABLY_API_KEY, clientId: "frontend",
            autoConnect: false, // Prevent auto-reconnect loops
            disconnectedRetryTimeout: 5000, // Wait 5 sec before retrying
            recover: (lastConnectionDetails) => {
                if (lastConnectionDetails && lastConnectionDetails.connectionKey) {
                    console.log("Recovering connection with key:", lastConnectionDetails.connectionKey);
                    return lastConnectionDetails.connectionKey;
                }
                console.warn("No valid connection key found, starting a new session.");
                return null;
            }});

        ably.connect();

        ably.connection.on("connected", () => {
            console.log("Connected to Ably");
            const gameChannel = ably.channels.get(CHANNEL_NAME);
            setChannel(gameChannel);

            // Send a keep-alive ping every 20 seconds
            const keepAlive = setInterval(() => {
                gameChannel.publish("ping", { timestamp: Date.now() });
            }, 20000);

            // Cleanup on unmount
            return () => {
                clearInterval(keepAlive);
                ably.close();
            };
        });


    }, []);

    return channel;
};


//Below is the code for using WebSocket instead of Ably
/*
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
        };
    }, []);

    return socket;
}*/