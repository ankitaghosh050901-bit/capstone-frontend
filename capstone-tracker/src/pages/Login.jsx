// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
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
import bgImage from "../assets/image1.jpg";   // ✅ ADD THIS

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
    // ✅ FULL-SCREEN BACKGROUND IMAGE (ONLY CHANGE)
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ✅ LOGIN CARD — UNCHANGED */}
      <Paper elevation={3} sx={{ p: 6, width: '100%', maxWidth: 450,  border: "4px solid black", }}>
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!form.username || !form.password || form.password.length < 7}
          >
            LOGIN
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
