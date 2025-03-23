import React, { useState, useEffect } from 'react';
import {
  Container,
  Box as SafeBox,
  Paper as SafePaper,
  Typography as SafeTypography,
  TextField as SafeTextField,
  Button as SafeButton,
  IconButton as SafeIconButton,
  InputAdornment as SafeInputAdornment,
  Link as SafeLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SafePassImage from '../assets/logo.png';
import '../styles/styles.css';

const Login = ({ notificationsRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.logoutMessage) {
      notificationsRef.current.showSnackbar(location.state.logoutMessage, 'success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, notificationsRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username,
          password,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('username', username);
        notificationsRef.current.showSnackbar('Login successful!', 'success');
        navigate('/dashboard');
      } else {
        notificationsRef.current.showSnackbar(data.message || 'Invalid credentials', 'error');
      }
    } catch (error) {
      notificationsRef.current.showSnackbar('Error connecting to the server.', 'error');
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container component="main" maxWidth="xs">
      <SafeBox className="safeContainer">
        <SafePaper className="safePaper" elevation={3}>
          <SafeBox className="safeHeader">
            <SafeBox
              component="img"
              src={SafePassImage}
              alt="SafePass"
              className="safeLogo"
            />
            <SafeTypography component="h1" variant="h5" className="safeTitle">
              Welcome to SafePass
            </SafeTypography>
            <SafeTypography variant="body2" color="text.secondary" align="center">
              All passwords under your control
            </SafeTypography>
          </SafeBox>

          <form onSubmit={handleSubmit} noValidate>
            <SafeTextField
              required
              fullWidth
              margin="normal"
              id="username"
              name="username"
              label="Username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                className: 'safeTextField'
              }}
            />

            <SafeTextField
              required
              fullWidth
              margin="normal"
              id="password"
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                className: 'safeTextField',
                endAdornment: (
                  <SafeInputAdornment position="end">
                    <SafeIconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </SafeIconButton>
                  </SafeInputAdornment>
                ),
              }}
            />

            <SafeButton type="submit" fullWidth variant="contained" className="safeSubmitButton">
              Sign In
            </SafeButton>

            <SafeBox className="safeLinkContainer">
              <SafeLink component={RouterLink} to="/register" variant="body2" className="safeLink">
                Don't have an account? Sign Up
              </SafeLink>
              <SafeLink component={RouterLink} to="/forgot-password" variant="body2" className="safeLink">
                Forgot password?
              </SafeLink>
            </SafeBox>
          </form>
        </SafePaper>
      </SafeBox>
    </Container>
  );
};

export default Login;