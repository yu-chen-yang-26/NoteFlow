import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import Main from './pages/Main/Main';
import Flow from './pages/Flow/Flow';
import Node from './pages/Node/Node';
import ResetPage from './pages/ForgotPassword/ResetPage';
import { UserProvider, MediaProvider } from './hooks/useApp';
import { PageTabProvider } from './hooks/usePageTab';
import { QuillProvider } from './API/useQuill';

const Router = () => {
  return (
    <BrowserRouter>
      <UserProvider>
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
                <Route element={<ResetPage />} path="/resetPassword" />
              </Routes>
            </QuillProvider>
          </PageTabProvider>
        </MediaProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default Router;
