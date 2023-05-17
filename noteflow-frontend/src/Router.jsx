<<<<<<< HEAD
import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { ForgotPassword } from "./pages/ForgotPassword/ForgotPassword";
import Main from "./pages/Main/Main";
import Flow from "./pages/Flow/Flow";
import Node from "./pages/Node/Node";
import { UserProvider, MediaProvider } from "./hooks/useApp";
import { PageTabProvider } from "./hooks/usePageTab";
import { QuillProvider } from "./API/useQuill";
=======
import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import Main from './pages/Main/Main';
import Flow from './pages/Flow/Flow';
import Node from './pages/Node/Node';
import { UserProvider } from './hooks/useApp';
import ResetPage from './pages/ForgotPassword/ResetPage';

>>>>>>> yoho
const Router = () => {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route element={<ResetPage />} path="/reset-password" />
      </Routes> */}
      <UserProvider>
<<<<<<< HEAD
        <MediaProvider>
          <PageTabProvider>
            <QuillProvider>
              <Routes>
                <Route element={<Login />} path="/" />
                <Route element={<Register />} path="/register" />
                <Route element={<ForgotPassword />} path="/forgotPassword" />
                <Route element={<Main />} path="/home" />
                <Route element={<Flow />} path="/flow" />
                <Route element={<Node />} path="/node" />
              </Routes>
            </QuillProvider>
          </PageTabProvider>
        </MediaProvider>
=======
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Register />} path="/register" />
          <Route element={<ForgotPassword />} path="/forgotPassword" />
          <Route element={<Main />} path="/home" />
          <Route element={<Flow />} path="/flow" />
          <Route element={<Node />} path="/node" />
        </Routes>
>>>>>>> yoho
      </UserProvider>
    </BrowserRouter>
  );
};

export default Router;
