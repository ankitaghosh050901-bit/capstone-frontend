// src/pages/Activities.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Grid, Paper, Divider, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const activityTypes = ['running', 'walking', 'cycling', 'yoga', 'gym'];

export default function Activities() {

  const today = new Date().toLocaleDateString("en-CA");

  const [form, setForm] = useState({
    activity_type: '',
    steps: '',
    calories_burned: '',
    duration: '',
    date: today
  });

  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const [editingLogId, setEditingLogId] = useState(null);
  const [editForm, setEditForm] = useState({
    activity_type: '',
    steps: '',
    calories_burned: '',
    duration: '',
    date: today
  });

  const isFormIncomplete =
    !form.activity_type ||
    !form.steps ||
    !form.calories_burned ||
    !form.duration ||
    !form.date;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditFormChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const fetchLogs = async () => {
    try {
      const res = await api.get('logs/');
      setLogs(res.data);
    } catch (err) {
      setError('Failed to fetch logs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('logs/', form);
      await fetchLogs();
      setForm({
        activity_type: '',
        steps: '',
        calories_burned: '',
        duration: '',
        date: today
      });
    } catch {
      setError('Failed to submit activity');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this activity log?");
    if (!confirmed) return;

    try {
      await api.delete(`logs/${id}/`);
      setLogs(prev => prev.filter(log => log.id !== id));
    } catch {
      setError('Failed to delete log');
    }
  };

  // ✅ FIX: preserve original date while editing
  const startEdit = (log) => {
    setEditingLogId(log.id);
    setEditForm({
      activity_type: log.activity_type,
      steps: log.steps,
      calories_burned: log.calories_burned,
      duration: log.duration,
      date: log.date   // 🔥 ORIGINAL DATE
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`logs/${editingLogId}/`, editForm);
      await fetchLogs();
      setEditingLogId(null);
    } catch {
      setError('Failed to update log');
    }
  };

  useEffect(() => {
    fetchLogs();
    setForm(prev => ({ ...prev, date: today }));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>Log Your Activity</Typography>

      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Activity Type" name="activity_type"
              value={form.activity_type} onChange={handleChange} required>
              {activityTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Steps" name="steps" type="number"
              value={form.steps} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Calories Burned" name="calories_burned"
              type="number" value={form.calories_burned} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Duration (min)" name="duration"
              type="number" value={form.duration} onChange={handleChange} required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Date"
              InputLabelProps={{ shrink: true }}
              name="date" value={form.date}
              onChange={handleChange} required
              inputProps={{ min: today, max: today }} />
          </Grid>
        </Grid>

        <Button variant="contained" sx={{ mt: 3 }} type="submit" disabled={isFormIncomplete}>
          Submit Activity
        </Button>
      </form>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6">Previous Logs</Typography>

      {logs.map((log) => (
        <Paper key={log.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
          {editingLogId === log.id ? (
            <Box component="form" onSubmit={handleSaveEdit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField select fullWidth label="Activity Type"
                    name="activity_type"
                    value={editForm.activity_type}
                    onChange={handleEditFormChange} required>
                    {activityTypes.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Steps" type="number"
                    name="steps" value={editForm.steps}
                    onChange={handleEditFormChange} required />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Calories Burned"
                    type="number" name="calories_burned"
                    value={editForm.calories_burned}
                    onChange={handleEditFormChange} required />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Duration (min)"
                    type="number" name="duration"
                    value={editForm.duration}
                    onChange={handleEditFormChange} required />
                </Grid>

                {/* 🔒 DATE LOCKED */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={editForm.date}
                    disabled
                  />
                </Grid>
              </Grid>

              <Button variant="contained" sx={{ mt: 2, mr: 1 }} type="submit">Save</Button>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditingLogId(null)}>Cancel</Button>
            </Box>
          ) : (
            <>
              <Typography><strong>Activity:</strong> {log.activity_type}</Typography>
              <Typography><strong>Steps:</strong> {log.steps}</Typography>
              <Typography><strong>Calories:</strong> {log.calories_burned}</Typography>
              <Typography><strong>Duration:</strong> {log.duration} mins</Typography>
              <Typography><strong>Date:</strong> {log.date}</Typography>

              <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton size="small" onClick={() => startEdit(log)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(log.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </>
          )}
        </Paper>
      ))}
    </Box>
  );
}
