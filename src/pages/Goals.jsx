// src/pages/Goals.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../services/goalService';

export default function Goals() {
  const today = new Date().toISOString().split("T")[0];

  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ 
    step_goal: '', 
    calorie_goal: '', 
    date: today           // auto-set today's date
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchGoals();
      setGoals(data);
    } catch (err) {
      console.error('Failed to fetch goals', err);
      setError('Could not load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (editId) {
        await updateGoal(editId, form);
      } else {
        await createGoal(form);
      }
      setForm({ step_goal: '', calorie_goal: '', date: today });
      setEditId(null);
      loadGoals();
    } catch (err) {
      console.error('Error saving goal', err);
      setError(err.response?.data?.date?.[0] || "Failed to save goal");
    }
  };

  const handleEdit = (goal) => {
    setForm({
      step_goal: goal.step_goal,
      calorie_goal: goal.calorie_goal,
      date: goal.date,
    });
    setEditId(goal.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error('Error deleting goal', err);
      setError('Failed to delete goal');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Set Your Fitness Goals
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 500, mx: 'auto', mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Step Goal"
            type="number"
            name="step_goal"
            value={form.step_goal}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Calorie Goal"
            type="number"
            name="calorie_goal"
            value={form.calorie_goal}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* DATE FIELD ADDED */}
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: today,  // cannot pick past dates
              max: today,  // cannot pick future dates
            }}
            margin="normal"
            required
          />

          <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
            {editId ? 'UPDATE GOAL' : 'SET GOAL'}
          </Button>
        </form>
      </Paper>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h5" gutterBottom>
        Your Goals
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : goals.length === 0 ? (
        <Typography>No goals found.</Typography>
      ) : (
        goals.map((g) => (
          <Paper key={g.id} sx={{ p: 2, mb: 2 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography>
                  <strong>Steps Goal:</strong> {g.step_goal}
                </Typography>
                <Typography>
                  <strong>Calorie Goal:</strong> {g.calorie_goal}
                </Typography>
                <Typography>
                  <strong>Date:</strong> {g.date}
                </Typography>
              </Grid>

              <Grid item>
                <IconButton onClick={() => handleEdit(g)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => handleDelete(g.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Box>
  );
}
