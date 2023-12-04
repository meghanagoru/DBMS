import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './login.js';
import Register from './register.js';
import HomePage from './homepage';
import Profile from './profile.js';
import Payment from './payment';
import DhomePage from './d_homepage';
import NavigationBar from './navbar';
function App() {
  const [token, setToken] = useState('');
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/login" element={<Login setToken={setToken}/>} />
        <Route path="/register" element={<Register/>} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/payment' element={<Payment/>}/>
        <Route path='/d_homepage' element={<DhomePage/>}/>
        <Route path='/navbar' element={<NavigationBar/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
