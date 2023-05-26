import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import jwt_decode from 'jwt-decode';
import './Login.scss';
import instance from '../../API/api';
import { SHA256 } from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import TryMe from '../../Components/TryMe/tryMe';
import { US, TW } from 'country-flag-icons/react/3x2';
import { useTranslation } from 'react-i18next';

// gcloud 註冊的 ＮoteFlow Project 帳號
const client_id =
  '390935399634-2aeudohkkr8kf634paoub0sjnlp7c1ap.apps.googleusercontent.com';

const Login = () => {
  const languageDiv = {
    en: <US title="United States" value="en" />,
    zh: <TW tilte="Taiwan" value="zh" />,
  };

  const divRef = useRef(null);
  const { i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [showTryMe, setShowTryMe] = useState(false); //切換 logo 以及 tryme
  const [alarms, setAlarms] = useState('');

  const navigateTo = useNavigate();
  const { refetchFromLocalStorage, user, isMobile } = useApp();

  useEffect(() => {
    if (user && user.logined) navigateTo('/home');
  }, [user]);

  const handleCallbackResponse = (res) => {
    const userObject = jwt_decode(res.credential);
    instance
      .post('/user/google-login', { user: userObject })
      .then((res) => {
        if (res.status == 200) {
          refetchFromLocalStorage();
          navigateTo('/home');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordHashed = SHA256(password).toString();
    const request = {
      user: {
        email: email,
        password: passwordHashed,
      },
    };
    instance
      .post('/user/login', request)
      .then((res) => {
        refetchFromLocalStorage();
        navigateTo('/home');
      })
      .catch((e) => {
        if (e.response.status === 401) {
          setAlarms('*Account or password error');
        } else if (Math.floor(e.response.status / 100) === 5) {
          setAlarms('*Internal server error');
        }
      });
  };

  useEffect(() => {
    /* global google */
    if (divRef.current) {
      google.accounts.id.initialize({
        client_id: client_id,
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(document.getElementById('signInDiv'), {
        width: '200',
      });

      google.accounts.id.prompt();
    }
  }, [divRef.current]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setShowLogo(true);
    }, 2000);

    const timer2 = setTimeout(() => {
      setShowTryMe(true);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className={`${isMobile ? 'login-mobile' : 'login'}`}>
      <div className={`${isMobile ? 'logo-mobile' : 'logo'}`}>
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={showLogo ? 'logo' : 'tryme'}
            classNames="fade"
            timeout={500}
          >
            {showLogo ? (
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={showTryMe ? 'tryme' : 'h1'}
                  classNames="fade"
                  timeout={500}
                >
                  {showTryMe ? <TryMe /> : <h1>Try Me</h1>}
                </CSSTransition>
              </SwitchTransition>
            ) : (
              <div>
                <img
                  loading="lazy"
                  src="assets/logo.png"
                  width={isMobile ? '120' : '200'}
                  height={isMobile ? '120' : '200'}
                />
                <h1>NoteFlow</h1>
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>

      <div className={`${isMobile ? 'info-mobile' : 'info'}`}>
        <h2>Login</h2>
        <div className="infoContainer">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            style={{ margin: '1vh 1vw', width: isMobile ? '100%' : '' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              size="small"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              size="small"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <div
              style={{
                color: 'red',
                height: '18px',
                // border: '1px solid black',
                textAlign: 'left',
                padding: '0 5px 0 5px',
              }}
            >
              {alarms}
            </div>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 1 }}
              style={{
                backgroundColor: '#0e1111',
                color: 'white',
                paddingTop: '1vh',
                textTransform: 'none',
              }}
            >
              Login
            </Button>
            <div
              className="links"
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Link
                variant="body2"
                style={{
                  color: '#414a4c',
                  cursor: 'pointer',
                  // fontSize: '1vw',
                }}
                onClick={() => navigateTo('/forgotPassword')}
              >
                Forgot password?
              </Link>
              <Link
                variant="body2"
                style={{
                  color: '#414a4c',
                  cursor: 'pointer',
                  // fontSize: '1vw',
                }}
                onClick={() => navigateTo('/register')}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </div>
          </Box>
        </div>
        <div className="horizontalLine">
          <span>OR</span>
        </div>
        <div id="signInDiv" ref={divRef}></div>
      </div>
    </div>
  );
};

export { Login };
