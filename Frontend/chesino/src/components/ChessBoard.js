import PropTypes from 'prop-types';
import './ChessBoard.css';
import { useState } from 'react';
import { MOVE } from '../ChessGame';

export const ChessBoard = ({ chess, setBoard, socket, board }) => {
    const [from, setFrom] = useState(null);
    //We create a map to store the pieces
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
    const [isSelected, setIsSelected] = useState(null);
    return (
        <div className="chessboard">
            {board.map((row, i) => (
                    row.map((square, j) => {
                        const pos = String.fromCharCode(97 + (j % 8)) + "" + (8 - i);
                        return (
                        <div onClick={() => {
                            if(chess.get(pos) !== undefined)
                            {
                                if(from === null)
                                {
                                    setIsSelected(pos);
                                    setFrom(pos);
                                    /*let avail = chess.moves({square: pos});
                                    for(let i of avail)
                                    {
                                        let squarea = document.getElementById(i);
                                        squarea.style.backgroundColor = "red";
                                    }*/
                                }
                            }
                                if(from !== null)
                                {
                                    setIsSelected(false);
                                    try{
                                        //We send the move to the server
                                        socket.send(JSON.stringify({
                                            type: MOVE,
                                            move: {
                                                from: from,
                                                to: pos,
                                            }
                                        }));

                                        /*let avail = chess.moves({square: from});
                                        for(let i of avail)
                                        {
                                            let squarea = document.getElementById(i);
                                            squarea.style.backgroundColor = null;
                                        }*/

                                        setFrom(null);
                                    }
                                    catch(e)
                                    {
                                        setFrom(null);
                                    }
                                }
                        }} 
                        //We set the color of the square based on the sum of the row and column
                        id = {pos} key={`${i}-${j}`} className={`${(i + j) % 2 === 0 ? "lgreen" : "dgreen"} ${pos === isSelected ? 'parent' : ''}`} >

                            {/*If the square is not empty, we display the piece*/}
                            {square ? <img className={pos === isSelected ? '' : 'dropShadow'} src={pieces.get(square.color === 'b' ? square.type : square.type.toUpperCase())} alt={square.type} /> : ""}
                        </div>
                        )
                    })
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