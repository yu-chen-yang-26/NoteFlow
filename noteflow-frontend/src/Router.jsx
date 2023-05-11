import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import Main from './pages/Main/Main';
import Flow from './pages/Flow/Flow';
import Node from './pages/Node/Node';
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path='/' />
        <Route element={<Register />} path='/register' />
        <Route element={<ForgotPassword />} path='/forgotPassword' />
        <Route element={<Main />} path='/home' />
        <Route element={<Flow />} path='/flow' />
        <Route element={<Node />} path='/node' />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
