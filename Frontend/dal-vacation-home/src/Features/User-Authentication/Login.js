import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { signIn } from '../../utils/Auth';
import './Login.css';

const LoginPage = ({ onAuthStateChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);

  const handleLogin = async () => {
    try {
      const result = await signIn(email, password);
      console.log(result);
      if (result.challengeParameters) {
          onAuthStateChange('QUESTION', result.cognitoUser);
      } else if (result.tokens) {
          onAuthStateChange('AUTHENTICATED');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container">
        <div className="login-box">
            <Typography variant="h4" className="login-title"><strong>Login</strong></Typography>
            <TextField
                required
                id="outlined-required"
                label="Email"
                margin="normal"
                onChange={handleEmailChange}
                fullWidth
                autoFocus
            />
            <TextField
                required
                id="outlined-required"
                label="Password"
                type="password"
                margin="normal"
                onChange={handlePasswordChange}
                fullWidth
            />
            <Button
                variant="contained"
                color="primary"
                size="large"
                className="login-button"
                onClick={handleLogin}
                sx={{ mt: 3 }}
            >
                Login
            </Button>
            <Link to="/signup" className="login-link">Don't have an account? Signup</Link>
        </div>
    </div>
  );
};

export default LoginPage;
