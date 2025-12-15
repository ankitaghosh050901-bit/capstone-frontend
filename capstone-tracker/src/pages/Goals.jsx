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

const getTodayLocal = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ 
    step_goal: '', 
    calorie_goal: '', 
    date: getTodayLocal()
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFormIncomplete =
    !form.step_goal ||
    !form.calorie_goal ||
    !form.date;

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await fetchGoals();
      setGoals(data);
    } catch {
      setError('Could not load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "date") return;
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

      setForm({
        step_goal: '',
        calorie_goal: '',
        date: getTodayLocal(),
      });

      setEditId(null);
      loadGoals();
    } catch {
      setError("Failed to save goal");
    }
  };

  // ✅ FIXED EDIT LOGIC
  const handleEdit = (goal) => {
    setForm({
      step_goal: goal.step_goal,
      calorie_goal: goal.calorie_goal,
      date: goal.date || goal.created_at?.split("T")[0], // 🔥 FIX
    });
    setEditId(goal.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    await deleteGoal(id);
    setGoals(prev => prev.filter(g => g.id !== id));
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

          <TextField
            fullWidth
            label="Date"
            type="date"
            value={form.date}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            disabled
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            type="submit"
            disabled={isFormIncomplete}
          >
            {editId ? 'UPDATE GOAL' : 'SET GOAL'}
          </Button>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Your Goals
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : goals.map((g) => (
        <Paper
          key={g.id}
          sx={{ p: 2, mb: 2, border: '2px solid #1976d2', borderRadius: 2 }}
        >
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography><strong>Steps Goal:</strong> {g.step_goal}</Typography>
              <Typography><strong>Calorie Goal:</strong> {g.calorie_goal}</Typography>
              <Typography><strong>Date:</strong> {g.date || g.created_at?.split("T")[0]}</Typography>
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
      ))}
    </Box>
  );
}
