import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import http from 'http';

/*const server = http.createServer((req, res) => {
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    res.end("WebSocket server is running.");
});*/
const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();
wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
    /*ws.on("error", (err) => {
        console.error("WebSocket error:", err);
    });*/
});

//server.listen(8080, () => console.log("WebSocket server running on port 8080"));