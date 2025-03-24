import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PasswordGenerator from '../components/PasswordGenerator';
import PasswordStrength from '../components/PasswordStrength';
import '../styles/styles.css';

const Dashboard = ({ notificationsRef }) => {
  const [passwords, setPasswords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState({ title: '', username: '', password: '' });
  const [editingPassword, setEditingPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const messages = {
    userNotLoggedIn: 'User not logged',
    fetchDataError: 'Failed to fetch data',
    fetchDataSuccess: 'Passwords found.',
    fetchDataNoPasswords: 'No passwords found.',
    copyPasswordSuccess: 'Password copied to clipboard',
    copyPasswordError: 'Failed to copy password',
    deletePasswordSuccess: 'Password deleted successfully',
    deletePasswordError: 'Failed to delete password',
    savePasswordSuccess: 'Password saved successfully',
    savePasswordError: 'Failed to save password',
    serverError: 'Error connecting to server',
    allFieldsRequired: 'All fields are required',
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedUserName = localStorage.getItem('username');
      
      if (!storedUserName) {
        notificationsRef.current.showSnackbar(messages.userNotLoggedIn, 'error');
        navigate('/login');
        return;
      }

      setUserName(storedUserName);

      try {
        const response = await fetch(`http://localhost:8000/dashboard.php?username=${storedUserName}`);
        const data = await response.json();
        
        if (data.success) {
          setPasswords(data.passwords);
        } else {
          notificationsRef.current.showSnackbar(data.message || messages.fetchDataError, 'error');
          navigate('/login');
        }
      } catch (error) {
        notificationsRef.current.showSnackbar(messages.serverError, 'error');
        navigate('/login');
      }
    };

    checkAuthentication();
  }, [navigate, notificationsRef, messages.userNotLoggedIn, messages.fetchDataError, messages.serverError]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      notificationsRef.current.showSnackbar(messages.copyPasswordSuccess, 'success');
    } catch (err) {
      notificationsRef.current.showSnackbar(messages.copyPasswordError, 'error');
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: passwordId }),
      });

      const data = await response.json();

      if (data.success) {
        setPasswords((prev) => prev.filter((p) => p.id !== passwordId));
        notificationsRef.current.showSnackbar(data.message || messages.deletePasswordSuccess, 'success');
      } else {
        notificationsRef.current.showSnackbar(data.message || messages.deletePasswordError, 'error');
      }
    } catch (error) {
      notificationsRef.current.showSnackbar(messages.serverError, 'error');
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
      notificationsRef.current.showSnackbar(messages.allFieldsRequired, 'warning');
      return;
    }
  
    const method = editingPassword ? 'PUT' : 'POST';
    const url = editingPassword 
      ? `http://localhost:8000/dashboard.php?id=${editingPassword.id}` 
      : 'http://localhost:8000/dashboard.php';
  
    try {
      const payload = {
        title: newPassword.title,
        username: newPassword.username,
        password: newPassword.password,
        created_by: userName,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (editingPassword) {
          setPasswords((prev) =>
            prev.map((p) => (p.id === editingPassword.id ? { ...newPassword, id: p.id } : p))
          );
          notificationsRef.current.showSnackbar(data.message || messages.savePasswordSuccess, 'success');
        } else {
          const newEntry = { 
            ...newPassword, 
            id: data.id || Date.now(), 
            created_by: userName 
          };
          setPasswords((prev) => [...prev, newEntry]);
          notificationsRef.current.showSnackbar(data.message || messages.savePasswordSuccess, 'success');
        }
        
        setDialogOpen(false);
        setEditingPassword(null);
        setIsSaveEnabled(false);
      } else {
        notificationsRef.current.showSnackbar(data.message || messages.savePasswordError, 'error');
      }
    } catch (error) {
      notificationsRef.current.showSnackbar(messages.serverError, 'error');
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
          <Button
            variant="contained"
            color="success"
            startIcon={<AddIcon />}
            onClick={handleAddPassword}>
            Add Password
          </Button>
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
                            <Typography variant="h6" className="passwordTitle">
                              {password.title}
                            </Typography>
                            <Typography className="passwordUsername">
                              {password.username}
                            </Typography>
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
                          <Typography variant="body2" className="passText">
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
            <PasswordGenerator 
              onGenerate={(password) => setNewPassword((prev) => ({ ...prev, password }))}
              notificationsRef={notificationsRef}
            />
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