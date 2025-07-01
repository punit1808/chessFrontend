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


  return (
      
      <div className="App" >
        {/* <div className='Navbar'>
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/Home">Home</Link> 
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/">Game</Link> 
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/Start">Start</Link> 
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/login">Login/Signup</Link> 
        </div> */}
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
