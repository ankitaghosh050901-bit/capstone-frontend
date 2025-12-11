// src/redux/progressSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/progress/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState: {
    total_activities: 0,
    total_steps: 0,
    total_calories: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.total_activities = action.payload.total_activities;
        state.total_steps = action.payload.total_steps;
        state.total_calories = action.payload.total_calories;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default progressSlice.reducer;
