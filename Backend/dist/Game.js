"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.publish(messages_1.INIT_GAME, JSON.stringify({
            payload: {
                colour: "white"
            }
        }));
        this.player2.publish(messages_1.INIT_GAME, JSON.stringify({
            payload: {
                colour: "black"
            }
        }));
    }
    makeMove(socket, move) {
        if (this.moveCount % 2 == 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 == 1 && socket !== this.player2) {
            return;
        }
        try {
            this.board.move(move);
            this.player2.publish(messages_1.MOVE, JSON.stringify({
                payload: move
            }));
            this.player1.publish(messages_1.MOVE, JSON.stringify({
                payload: move
            }));
        }
        catch (e) {
            return;
        }
        if (this.board.isGameOver()) {
            this.player1.publish(messages_1.GAME_OVER, JSON.stringify({
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player2.publish(messages_1.GAME_OVER, JSON.stringify({
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
        }
        /* if(socket === this.player1)
         {
             console.log("sending move to player2")
             this.player2.send(JSON.stringify({
                 type: MOVE,
                 payload: move
             }))
         }
         else
         {
            console.log("sending move to player1")
             this.player1.send(JSON.stringify({
                 type: MOVE,
                 move
             }))
         }*/
        this.moveCount++;
    }
}
exports.Game = Game;
