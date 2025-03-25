import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import Ably from 'ably';

const ably = new Ably.Realtime({key:'S1xC5g.dsEmMA:Dt6EoWhWM6BWo9YoXNEHYRai95V6QHrTlX1CSzWtBJo', clientId: "server",
    recover: (lastConnectionDetails: { recoveryKey?: string } | null) => {
        if (lastConnectionDetails?.recoveryKey) {
            console.log("Recovering backend connection with key:", lastConnectionDetails.recoveryKey);
            return lastConnectionDetails.recoveryKey;
        }
        console.warn("No valid recovery key found, starting a new session.");
        return null;
    }});
//const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

const channel = ably.channels.get('chesino-game-backend');
ably.connection.on('connected', () => {
    gameManager.addUser(channel);
    channel.on('detached', () => gameManager.removeUser(channel));

    setInterval(() => {
        channel.publish('server-keepalive', { timestamp: Date.now() });
    }, 20000);
});
/*wss.on('connection', function connection( {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});*/

//server.listen(8080, () => console.log("WebSocket server running on port 8080"));


/*const server = http.createServer((req, res) => {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    res.end("WebSocket server is running.");
});*/