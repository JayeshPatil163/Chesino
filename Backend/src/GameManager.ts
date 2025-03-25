import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";
import Ably from 'ably';

export class GameManager {
    private games: Game[];
    private pendingUser: Ably.RealtimeChannel | null;
    private users: Ably.RealtimeChannel[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: Ably.RealtimeChannel) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket: Ably.RealtimeChannel) {
        this.users = this.users.filter(user => user !== socket)
        //we'll stop the game here
    }

    private addHandler(socket: Ably.RealtimeChannel) {
        socket.subscribe(INIT_GAME , (data) => {
                if(this.pendingUser)
                {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else
                {
                    this.pendingUser = socket;
                }
        })
        socket.subscribe(MOVE , (data) => {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game)
                {
                    const move = JSON.parse(data.toString());
                    game.makeMove(socket, move.data);
                }
        })

        /*socket.subscribe('message', (data) => {
            const message = JSON.parse(data.toString());
            console.log("It comes here under GameManager class... " + message);
            if(message.type === INIT_GAME) {
                if(this.pendingUser)
                {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else
                {
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE)
            {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game)
                {
                    game.makeMove(socket, message.move);
                }
            }
        })*/
    }
}