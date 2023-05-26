import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { UserProvider, MediaProvider } from './hooks/useApp';
import { PageTabProvider } from './hooks/usePageTab';
import { QuillProvider } from './API/useQuill';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';

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
              <React.Suspense
                fallback={
                  <div
                    className="loadingContainer"
                    style={{
                      width: '100vw',
                      height: '100vh',
                      position: 'relative',
                      background: '#e6e6e6',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(45% - 75px)',
                        left: 'calc(50% - 75px)',
                      }}
                    >
                      <LoadingScreen />
                    </div>
                  </div>
                }
              >
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
