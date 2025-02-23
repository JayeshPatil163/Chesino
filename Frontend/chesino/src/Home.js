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
      <Chessboard3D className="ditem"/>
        <div className="content">
        <h1>Home Page</h1>
        <button onClick={goToNextPage}>Go to Next Page</button>
        </div>
    </div>
  );
}

export default Home;
