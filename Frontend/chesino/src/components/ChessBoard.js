import PropTypes from 'prop-types';
import './ChessBoard.css';
import { useState } from 'react';
import { MOVE } from '../ChessGame';

export const ChessBoard = ({ chess, setBoard, socket, board }) => {
    const [from, setFrom] = useState(null);
    const pieces = new Map();
    pieces.set("p", "bp.png");
    pieces.set("r", "br.png");
    pieces.set("n", "bn.png");
    pieces.set("b", 'bb.png');
    pieces.set("q", "bq.png");
    pieces.set("k", "bk.png");
    pieces.set("P", "wp.png");
    pieces.set("R", "wr.png");
    pieces.set("N", "wn.png");
    pieces.set('B', 'wb.png');
    pieces.set("Q", "wq.png");
    pieces.set("K", "wk.png");
    //const [to, setTo] = use State(null);
    return (
        <div className="chessboard">
            {board.map((row, i) => (
                    row.map((square, j) => (
                        <div onClick={() => {
                                const pos = String.fromCharCode(97 + (j % 8)) + "" + (8 - i);
                                if(from === null)
                                {
                                    setFrom(pos);
                                }
                                else
                                {
                                    //const temp = String.fromCharCode(97 + j) + "" + i;
                                    try{
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        move: {
                                            from: from,
                                            to: pos,
                                        }
                                    }));

                                    /*chess.move({
                                        from: from,
                                        to: pos,
                                    });
                                
                                    setBoard(chess.board());*/
                                    console.log("Sent move", from, pos);
                                    setFrom(null);
                                    }
                                    catch(e)
                                    {
                                        setFrom(null);
                                    }
                                }
                            }
                        } key={`${i}-${j}`} className={`${(i + j) % 2 === 0 ? "lgreen" : "dgreen"}`} >
                            {square ? <img src={square.color === 'w' ? pieces.get(square.type) : pieces.get(square.type.toUpperCase())} alt={square.type} /> : ""}
                        </div>
                    ))
            ))}
        </div>
    )
}

ChessBoard.propTypes = {
    board: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.shape({
                square: PropTypes.string.isRequired,
                type: PropTypes.string.isRequired,
                color: PropTypes.string.isRequired,
            })
        )
    ).isRequired,
};