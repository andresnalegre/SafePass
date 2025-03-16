import React, { useState } from 'react';
import {
  Container,
  Box as SafeBox,
  Paper as SafePaper,
  Typography as SafeTypography,
  TextField as SafeTextField,
  Button as SafeButton,
  IconButton as SafeIconButton,
  InputAdornment as SafeInputAdornment,
  Alert as SafeAlert,
  Fade as SafeFade,
  Link as SafeLink
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SafePassImage from '../assets/SafePass.png';
import '../styles/styles.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        setError(null);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Container component="main" maxWidth="xs">
      <SafeBox className="safeContainer">
        <SafeFade in={true} timeout={1000}>
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

            {error && (
              <SafeFade in={true}>
                <SafeAlert
                  severity="error"
                  className="safeAlert"
                  onClose={() => setError(null)}
                >
                  {error}
                </SafeAlert>
              </SafeFade>
            )}

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
        </SafeFade>
      </SafeBox>
    </Container>
  );
};

export default Login;