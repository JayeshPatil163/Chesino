import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import Ably from 'ably';

export class Game{
    public player1: Ably.RealtimeChannel;
    public player2: Ably.RealtimeChannel;
    private board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount = 0;

    constructor(player1: Ably.RealtimeChannel, player2: Ably.RealtimeChannel) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.moves = [];
        this.startTime = new Date();
        this.player1.publish(INIT_GAME , JSON.stringify({
            payload : {
                colour : "white"
            }
        }))
        this.player2.publish(INIT_GAME , JSON.stringify({
            payload : {
                colour : "black"
            }
        }))
    }

    public makeMove(socket: Ably.RealtimeChannel, move: {
        from: string;
        to: string;
    })
    {
        if(this.moveCount%2 == 0 && socket !== this.player1)
        {
            return;
        }
        if(this.moveCount%2 == 1 && socket !== this.player2)
        {
            return;
        }
        try{
            this.board.move(move)
            this.player2.publish(MOVE, JSON.stringify({
                payload: move
            }))
            this.player1.publish(MOVE, JSON.stringify({
                payload: move
            }))
        }
        catch(e)
        {

            return;
        }

        if(this.board.isGameOver())
        {
            this.player1.publish(GAME_OVER, JSON.stringify({ payload: this.board.turn() === "w" ? "black" : "white"
            }))
            this.player2.publish(GAME_OVER, JSON.stringify({
                payload: {
                    winner : this.board.turn() === "w" ? "black" : "white"
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