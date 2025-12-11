import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/register/', form);
      alert('Registered successfully!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed!');
      console.error(error);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Box component="form" onSubmit={handleSubmit} sx={{ width: 400, p: 4, boxShadow: 3 }}>
        <Typography variant="h5" mb={2} textAlign="center">Register</Typography>
        <TextField name="username" label="Username" fullWidth margin="normal" onChange={handleChange} required />
        <TextField name="email" label="Email" fullWidth margin="normal" onChange={handleChange} required />
        <TextField name="password" label="Password" type="password" fullWidth margin="normal" onChange={handleChange} required />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={!form.username || !form.email || !form.password || form.password.leength<7 }>REGISTER</Button>
        
      </Box>
    </Box>
  );
};

export default Register;
