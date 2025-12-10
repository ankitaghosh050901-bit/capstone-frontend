// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';   // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
} from '@mui/material';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/login/', form);

      const token = res.data.access || res.data.token;
      if (!token) throw new Error('No token returned from server');

      localStorage.setItem('token', token);
      dispatch(loginSuccess(token));
      navigate('/home', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed — check credentials or server error');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            name="username"
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            required
            onChange={handleChange}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
            }
            label="Show Password"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            LOGIN
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
