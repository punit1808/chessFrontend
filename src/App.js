import React,{useState,useEffect} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';
import { Router, Routes, Route, Link, useNavigate  } from 'react-router-dom';
import StartGame from './Component/StartGame';
// import LoginButton from './components/LoginButton';
// import LogoutButton from './components/LogoutButton';
// import Test from './components/Test';
import axios from 'axios';
// import User from './Component/User';

const App=()=> {


  return (
      
      <div className="App" >
        <div className='Navbar'>
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/Home">Home</Link> 
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/">Game</Link> 
          <Link style={{textDecoration: 'none', color: 'green', fontWeight: 'bold',fontSize: 'large'}} to="/Start">Start</Link> 
          {/* <Link style={{textDecoration: 'none', color: 'red', fontWeight: 'bold',fontSize: 'large'}} to="/logout">Logout</Link>  */}
        </div>
        <Routes>
          <Route path="/" element={<h1>Chess Master</h1>} />
          <Route path="/Home" element={<>
          <h1>Home Page</h1>
          {/* <Test/> */}
          {/* <LogoutButton/> */}
          </>} />
          <Route path="/Start" element={<StartGame/>} />
          {/* <Route path="/logout" element={<LogoutButton/>} /> */}
          
        </Routes>
      </div>

  );
}

export default App;
