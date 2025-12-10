// src/services/goalService.js
import api from './api';  // your existing axios instance with auth token

export async function fetchGoals() {
  const res = await api.get('goals/');
  return res.data;
}

export async function createGoal(data) {
  const res = await api.post('goals/', data);
  return res.data;
}

export async function updateGoal(id, data) {
  const res = await api.put(`goals/${id}/`, data);
  return res.data;
}

export async function deleteGoal(id) {
  const res = await api.delete(`goals/${id}/`);
  return res.data;
}
