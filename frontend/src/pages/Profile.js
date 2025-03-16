import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, TextField, Button, Avatar, Grid, Alert, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import { PhotoCamera, Delete } from '@mui/icons-material';

const Profile = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    user: '',
    avatarUrl: '',
  });
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/profile.php?user_id=1');
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setError(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError('Error fetching user data');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 1,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (data.success) {
        enqueueSnackbar('Password updated successfully', { variant: 'success' });
        setFormData({ password: '', confirmPassword: '' });
      } else {
        setError(data.message || 'Failed to update password');
        enqueueSnackbar(data.message || 'Failed to update password', { variant: 'error' });
      }
    } catch (err) {
      setError('Error updating password');
      enqueueSnackbar('Error updating password', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('user_id', 1);
  
    try {
      const response = await fetch('http://localhost:8000/profile.php', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      if (data.success) {
        const userResponse = await fetch('http://localhost:8000/profile.php?user_id=1');
        const userData = await userResponse.json();
        if (userData.success) {
          setUser(userData.user);
        }
        enqueueSnackbar('Avatar uploaded successfully', { variant: 'success' });
      } else {
        enqueueSnackbar(data.message || 'Failed to upload avatar', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error uploading avatar', { variant: 'error' });
    }
  };

  const handleRemove = async () => {
    try {
      const response = await fetch('http://localhost:8000/profile.php?user_id=1', {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, avatarUrl: '' }));
        enqueueSnackbar('Avatar removed successfully', { variant: 'info' });
      } else {
        enqueueSnackbar(data.message || 'Failed to remove avatar', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error removing avatar', { variant: 'error' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="h1" mb={2}>
          Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: '2.5rem',
                  bgcolor: 'primary.main',
                }}
                src={user.avatarUrl}
                alt={user.user}
              >
                {user.user ? user.user[0].toUpperCase() : ''}
              </Avatar>
              <Box mt={1}>
                <IconButton color="primary" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleUpload} />
                  <PhotoCamera />
                </IconButton>
                <IconButton color="secondary" onClick={handleRemove}>
                  <Delete />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={user.user}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} SafePass. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;