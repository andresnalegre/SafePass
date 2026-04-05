import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SafePassImage from '../assets/logo.svg';
import '../styles/styles.css';

const Login = ({ notificationsRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const errorMessages = {
    loginSuccess: 'Login successful!',
    invalidCredentials: 'Invalid credentials.',
    serverError: 'Error connecting to the server.',
  };

  useEffect(() => {
    if (location.state?.logoutMessage) {
      notificationsRef.current.showSnackbar(location.state.logoutMessage, 'success');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, notificationsRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('safepass_users') || '[]');
    const user = users.find((u) => u.username === username);

    if (!user || user.password !== btoa(password)) {
      notificationsRef.current.showSnackbar(errorMessages.invalidCredentials, 'error');
      return;
    }

    localStorage.setItem('user_id', user.id);
    localStorage.setItem('username', username);

    notificationsRef.current.showSnackbar(errorMessages.loginSuccess, 'success');

    setTimeout(() => {
      notificationsRef.current.showSnackbar(`Welcome, ${username}!`, 'success');
      window.location.reload();
    }, 1000);
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box className="safeContainer">
      <Paper className="safePaper" elevation={3}>
        <Box className="safeHeader">
          <Box
            component="img"
            src={SafePassImage}
            alt="SafePass"
            className="safeLogo"
          />
          <Typography component="h1" variant="h5" className="safeTitle">
            Welcome to SafePass
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            All passwords under your control
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
          <TextField
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
            InputProps={{ className: 'safeTextField' }}
          />

          <TextField
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
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" className="safeSubmitButton">
            Sign In
          </Button>

          <Box className="safeLinkContainer">
            <Link component={RouterLink} to="/register" variant="body2" className="safeLink">
              Sign Up
            </Link>
            <Link component={RouterLink} to="/forgot-password" variant="body2" className="safeLink">
              Forgot Password?
            </Link>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;