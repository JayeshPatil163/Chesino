import React, { useState } from "react";
import './ChessGame.css';
import { ChessBoard } from "./components/ChessBoard";
import { useSocket } from "./hooks/useSocket";
import { useEffect } from "react";
import { Chess } from "chess.js";
import { alert, toast } from "react-toastify";

//There's code repetetion here.
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

function ChessGame()
{
    const socket = useSocket();
    const message = [INIT_GAME, MOVE, GAME_OVER];
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());

    useEffect(() => {
        if(!socket)
        {
            return;
        }

        socket.subscribe(message, (data) => {
            console.log("Received message", data);

            switch(data.name)
            {
                case INIT_GAME:
                    //setGame(new Chess());
                    setBoard(game.board());
                    console.log("Game initialized");
                    break;
                case MOVE:
                    try{
                        game.move(data.data);
                    }
                    catch(e)
                    {
                        console.log("Invalid move ", data);
                    }
                    setBoard(game.board());
                    console.log("Move made");
                    break;
                case GAME_OVER:
                    toast("Game over and " + data.data + " wins");
                    console.log("Game over");
                    break;
                default:
                    console.log("Unknown message type", data.type);
            }
        })
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
                        socket.publish(INIT_GAME, {});
                    }}>Start Game</button>
                </div>
        </div>
    );
}

export default ChessGame;