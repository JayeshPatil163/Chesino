import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Chess from './ChessGame';
import Home from "./Home";
import { ToastContainer, toast } from 'react-toastify';

function App() {

  /*const navigate = useNavigate;
  
  const playChess = () =>
  {
    navigate("/next");
  }*/
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/next" element={<Chess />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
