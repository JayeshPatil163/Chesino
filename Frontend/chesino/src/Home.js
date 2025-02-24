import React from "react";
import { useNavigate } from "react-router-dom";
import Chessboard3D from './components/Chessboard3D';
import './Home.css';


function Home() {
  const navigate = useNavigate();

  const goToNextPage = () => {
    navigate("/next");
  };

  return (
    <div className="home">
      <Chessboard3D/>
      {/*<div className="filter">*/}
        <div className="content">
          <h1>WELCOME TO</h1>
          <h1>CHESINO</h1>
          <button onClick={goToNextPage}>Play Chess</button>
        </div>
        {/*</div>*/}
    </div>
  );
}

export default Home;
