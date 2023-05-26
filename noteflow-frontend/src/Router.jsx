import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
// import Login from './pages/Login/Login';
// import { Register } from './pages/Register/Register';
// import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
// import Main from './pages/Main/Main';
// import Flow from './pages/Flow/Flow';
// import Node from './pages/Node/Node';
// import ResetPage from './pages/ForgotPassword/ResetPage';
import { UserProvider, MediaProvider } from './hooks/useApp';
import { PageTabProvider } from './hooks/usePageTab';
import { QuillProvider } from './API/useQuill';

const Login = React.lazy(() => import('./pages/Login/Login'));
const Register = React.lazy(() => import('./pages/Register/Register'));
const ForgotPassword = React.lazy(() =>
  import('./pages/ForgotPassword/ForgotPassword'),
);
const ResetPage = React.lazy(() => import('./pages/ForgotPassword/ResetPage'));

const Main = React.lazy(() => import('./pages/Main/Main'));
const Flow = React.lazy(() => import('./pages/Flow/Flow'));
const Node = React.lazy(() => import('./pages/Node/Node'));

const Router = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <MediaProvider>
          <PageTabProvider>
            <QuillProvider>
              <React.Suspense fallback={<div>loading...</div>}>
                <Routes>
                  <Route element={<Login />} path="/" />
                  <Route element={<Register />} path="/register" />
                  <Route element={<ForgotPassword />} path="/forgotPassword" />
                  <Route element={<Main />} path="/home" />
                  <Route element={<Flow />} path="/flow" />
                  <Route element={<Node />} path="/node" />
                  <Route element={<ResetPage />} path="/resetPassword" />
                </Routes>
              </React.Suspense>
            </QuillProvider>
          </PageTabProvider>
        </MediaProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default Router;
