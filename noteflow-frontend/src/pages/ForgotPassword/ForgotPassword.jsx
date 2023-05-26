import React from 'react';
import { useState, useEffect } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import instance from '../../API/api';
import { useParams } from '../../hooks/useParams';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../hooks/useApp';
import TryMe from '../../Components/TryMe/tryMe';
import './ForgotPassword.scss';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [showLogo, setShowLogo] = useState(false);
  const [showTryMe, setShowTryMe] = useState(false); //切換 logo 以及 tryme
  const navigateTo = useNavigate();
  const { isMobile } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    instance.post('/user/reset-password-send-email', { email }).then((res) => {
      alert('Email 已經寄出，請前往收信');
    });
  };

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
    <div className={`${isMobile ? 'forgotPassword-mobile' : 'forgotPassword'}`}>
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
                <h1 className="noteflow-title">NoteFlow</h1>
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </div>

      <div className={`${isMobile ? 'info-mobile' : 'info'}`}>
        <h2>{t('Forgot password')}</h2>
        <div className="infoContainer">
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            style={{ margin: '1vh 1vw', width: '80%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('Email Address')}
              name="email"
              autoComplete="email"
              autoFocus
              size="small"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Button
                variant="contained"
                sx={{ mt: 2, mb: 2, width: '45%' }}
                style={{ backgroundColor: 'white', color: 'black' }}
                onClick={() => navigateTo('/')}
              >
                {t('Cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, mb: 2, width: '45%' }}
                style={{ backgroundColor: '#0e1111', color: 'white' }}
              >
                {t('Send')}
              </Button>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export { ForgotPassword };
