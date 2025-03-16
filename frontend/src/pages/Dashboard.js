import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PasswordGenerator from '../components/PasswordGenerator';
import PasswordStrength from '../components/PasswordStrength';
import '../styles/styles.css';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState({ title: '', username: '', password: '' });
  const [editingPassword, setEditingPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard.php');
        const data = await response.json();
        if (data.success) {
          setPasswords(data.passwords);
        } else {
          enqueueSnackbar('Failed to fetch passwords', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Error fetching passwords', { variant: 'error' });
      }
    };

    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:8000/dashboard.php');
        const data = await response.json();
        if (data.success && data.username) {
          setUserName(data.username);
        } else {
          enqueueSnackbar('Failed to fetch user name', { variant: 'error' });
        }
      } catch (error) {
        enqueueSnackbar('Error fetching user name', { variant: 'error' });
      }
    };

    fetchPasswords();
    fetchUserName();
  }, [enqueueSnackbar]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      enqueueSnackbar('Password copied to clipboard', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to copy password', { variant: 'error' });
    }
  };

  const togglePasswordVisibility = (passwordId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [passwordId]: !prev[passwordId],
    }));
  };

  const handleDeletePassword = async (passwordId) => {
    try {
      const response = await fetch('http://localhost:8000/dashboard.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id: passwordId }),
      });
      const data = await response.json();
      if (data.success) {
        setPasswords((prev) => prev.filter((p) => p.id !== passwordId));
        enqueueSnackbar('Password deleted successfully', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to delete password', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting password', { variant: 'error' });
    }
  };

  const handleAddPassword = () => {
    setNewPassword({ title: '', username: '', password: '' });
    setEditingPassword(null);
    setDialogOpen(true);
    setIsSaveEnabled(false);
  };

  const handleEditPassword = (password) => {
    setNewPassword(password);
    setEditingPassword(password);
    setDialogOpen(true);
    setIsSaveEnabled(false);
  };

  const handleSavePassword = async () => {
    if (!newPassword.title || !newPassword.username || !newPassword.password) {
      enqueueSnackbar('All fields are required', { variant: 'warning' });
      return;
    }
  
    const method = editingPassword ? 'PUT' : 'POST';
    const url = editingPassword ? `http://localhost:8000/dashboard.php?id=${editingPassword.id}` : 'http://localhost:8000/dashboard.php';
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          title: newPassword.title,
          username: newPassword.username,
          password: newPassword.password,
        }),
      });
      const data = await response.json();
      if (data.success) {
        if (editingPassword) {
          setPasswords((prev) =>
            prev.map((p) => (p.id === editingPassword.id ? { ...newPassword, id: p.id } : p))
          );
          enqueueSnackbar('Password updated successfully', { variant: 'success' });
        } else {
          setPasswords((prev) => [...prev, { ...newPassword, id: Date.now() }]);
          enqueueSnackbar('Password added successfully', { variant: 'success' });
        }
        setDialogOpen(false); // Fechar o diálogo após salvar
        setEditingPassword(null);
        setIsSaveEnabled(false); // Desabilitar o botão Save
      } else {
        enqueueSnackbar('Failed to save password', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error saving password', { variant: 'error' });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (field, value) => {
    setNewPassword((prev) => ({ ...prev, [field]: value }));
    setIsSaveEnabled(true);
  };

  const filteredPasswords = passwords.filter((password) =>
    (password.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (password.username?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="dashContainer">
      <Navbar onDrawerToggle={handleDrawerToggle} />
      <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
      <Container component="main" maxWidth="xl" className="dashMain">
        <Toolbar />
        <Box className="dashHeader">
          <Typography variant="h4" gutterBottom>Welcome, {userName}</Typography>
          <Box className="dashActions">
            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              onClick={handleAddPassword}
            >
              Add Password
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box className="passHeader">
                  <Typography variant="h5">
                    Passwords
                    <Chip label={filteredPasswords.length} size="small" className="passCount" />
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search passwords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="searchField"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" className="searchIcon" />,
                    }}
                  />
                </Box>

                {filteredPasswords.length === 0 ? (
                  <Typography variant="h6" color="textSecondary" align="center">
                    No passwords found
                  </Typography>
                ) : (
                  filteredPasswords.map((password) => (
                    <Card key={password.id} className="passCard">
                      <CardContent>
                        <Box className="passDetails">
                          <Box>
                            <Typography variant="h6">{password.title}</Typography>
                            <Typography color="textSecondary">{password.username}</Typography>
                          </Box>
                          <Box className="passActions">
                            <Tooltip title={visiblePasswords[password.id] ? 'Hide Password' : 'Show Password'}>
                              <IconButton onClick={() => togglePasswordVisibility(password.id)} size="small">
                                {visiblePasswords[password.id] ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => handleEditPassword(password)} size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Copy Password">
                              <IconButton onClick={() => handleCopyPassword(password.password)} size="small">
                                <CopyIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => handleDeletePassword(password.id)} size="small" color="error">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        {visiblePasswords[password.id] && (
                          <Typography
                            variant="body2"
                            className="passText"
                          >
                            {password.password}
                          </Typography>
                        )}
                        <PasswordStrength password={password.password} />
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <PasswordGenerator onGenerate={(password) => setNewPassword((prev) => ({ ...prev, password }))} />
          </Grid>
        </Grid>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>{editingPassword ? 'Edit' : 'Add New Password'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              value={newPassword.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={newPassword.username}
              onChange={(e) => handleChange('username', e.target.value)}
            />
            <TextField
              margin="dense"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword.password}
              onChange={(e) => handleChange('password', e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={toggleShowPassword} size="small">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <PasswordStrength password={newPassword.password} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSavePassword} color="primary" disabled={!isSaveEnabled}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;