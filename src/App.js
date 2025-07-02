import React,{useState,useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';
import { Router, Routes, Route, Link, useNavigate  } from 'react-router-dom';
import StartGame from './Component/StartGame';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import axios from 'axios';
import StartPage from './components/StartPage';

const App=()=> {

  useEffect(() => {
      localStorage.removeItem('gameId');
    }, []);


  return (
      
      <div className="App" >
        <Routes>
          <Route path="/" element={<StartPage/>} />
          <Route path="/Home" element={<>
          <h1>Home Page</h1>
          </>} />
          <Route path="/Start" element={<StartGame/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/register" element={<RegisterForm/>} />
          
        </Routes>
      </div>

  );
}

export default App;
