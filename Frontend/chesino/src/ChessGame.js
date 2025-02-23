import React, { useState } from "react";
import './ChessGame.css';
import { ChessBoard } from "./components/ChessBoard";
import { useSocket } from "./hooks/useSocket";
import { useEffect } from "react";
import { Chess } from "chess.js";
import { alert, toast } from "react-toastify";

//Thre's code repetetion here.
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function ChessGame()
{
    const socket = useSocket();
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());

    useEffect(() => {
        if(!socket)
        {
            return;
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received message", message);

            switch(message.type)
            {
                case INIT_GAME:
                    //setGame(new Chess());
                    setBoard(game.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    try{
                        game.move(message.payload);
                    }
                    catch(e)
                    {
                        console.log("Invalid move ", e);
                    }
                    setBoard(game.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    toast("Game over and " + message.payload.winner + " wins");
                    console.log("Game over");
                    break;
                default:
                    console.log("Unknown message type", message.type);
            }
        }
    }, [socket]);

    if(!socket)
    {
                return <div>Connecting...</div>;
    }

    return(
        <div className="ChessPlayground">
                <div className="chessboardsurface">
                    <ChessBoard chess={game} setBoard={setBoard} socket={socket} board={board} />
                </div>
                <div className="controls">
                    <button onClick={() => {
                        socket.send(JSON.stringify({
                            type: INIT_GAME,
                        }));
                    }}>Start Game</button>
                </div>
        </div>
    );
}

export default ChessGame;