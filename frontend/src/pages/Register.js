import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Please enter a username');
      setMessage(null);
      return;
    }
    if (!password) {
      setError('Please enter a password');
      setMessage(null);
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your password');
      setMessage(null);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setMessage(null);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/register.php', {
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
        setMessage(data.message);
        setError(null);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message);
        setMessage(null);
      }
    } catch (err) {
      setError('Error connecting to server');
      setMessage(null);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box className="registerContainer">
      <IconButton
        onClick={() => navigate(-1)}
        className="registerBackButton"
        color="primary"
      >
        <ArrowBack />
      </IconButton>

      <Container component="main" maxWidth="xs" className="registerMainContainer">
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} className="registerPaper">
            <Box className="registerTitleBox">
              <Typography component="h1" variant="h5" className="registerTitle">
                Register
              </Typography>
            </Box>

            {message && (
              <Fade in={true}>
                <Alert severity="success" className="registerAlert">
                  {message}
                </Alert>
              </Fade>
            )}

            {error && (
              <Fade in={true}>
                <Alert severity="error" className="registerAlert">
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={handleSubmit} noValidate>
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
                InputProps={{
                  className: 'registerTextField'
                }}
              />

              <TextField
                required
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  className: 'registerTextField',
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

              <TextField
                required
                fullWidth
                margin="normal"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  className: 'registerTextField',
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="registerSubmitButton"
              >
                Register
              </Button>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;