"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        //we'll stop the game here
    }
    addHandler(socket) {
        socket.subscribe(messages_1.INIT_GAME, (data) => {
            if (this.pendingUser) {
                const game = new Game_1.Game(this.pendingUser, socket);
                this.games.push(game);
                this.pendingUser = null;
            }
            else {
                this.pendingUser = socket;
            }
        });
        socket.subscribe(messages_1.MOVE, (data) => {
            const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
            if (game) {
                const move = JSON.parse(data.toString());
                game.makeMove(socket, move.data);
            }
        });
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
exports.GameManager = GameManager;
