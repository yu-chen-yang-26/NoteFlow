import { useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { SHA256 } from 'crypto-js';
import instance from '../../API/api';
import './ResetPage.scss';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!email || !token) {
    console.log('qq');
    navigate('/');
  }

  useEffect(() => {
    // 想辦法先阻斷 useApp() 的 navigation->送請求過去
    instance
      .post('/user/reset-password-auth', { token, email })
      .then((res) => {
        if (res.status !== 200) {
          alert('The token has broken. Please resend email to us again.');
          navigate('/');
        }
      })
      .catch((e) => {
        alert('Request Timeout. Please resend email to us again.');
        navigate('/');
      });
  }, []);

  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [alarms, setAlarms] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== checkPassword) return;
    const passwordHashed = SHA256(password).toString();
    const request = {
      newPassword: passwordHashed,
    };
    instance.post('/user/reset-password-renew', request).then((res) => {
      if (res.status === 200) {
        alert('Success! You can log in with your new password!');
        navigate('/');
      }
    });
  };

  return email && token ? (
    <div className="login">
      <div className="login-container">
        <div className="logo">
          <img src="assets/logo.png" alt="" width="190" height="190" />
          <h1>NoteFlow</h1>
        </div>
        <div className="info">
          <h2>Reset Password</h2>
          <div className="infoContainer">
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              style={{ margin: '10px 15px' }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={'Password'}
                type="password"
                id="password"
                autoComplete="current-password"
                size="small"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={'Check Password'}
                type="password"
                id="check-password"
                autoComplete="current-password"
                size="small"
                onChange={(e) => {
                  setCheckPassword(e.target.value);
                }}
              />
              <div
                style={{
                  color: 'red',
                  height: '18px',
                  // border: '1px solid black',
                  textAlign: 'left',
                  padding: '0 10px 0 10px',
                }}
              >
                {alarms}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: '100%',
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 2, mb: 2, width: '45%' }}
                  style={{ backgroundColor: '#0e1111', color: 'white' }}
                >
                  {'Register'}
                </Button>
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ResetPage;
