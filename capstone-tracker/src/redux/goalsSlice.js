// src/redux/goalsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch goals
export const fetchGoals = createAsyncThunk(
  "goals/fetchGoals",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/goals/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create goal
export const createGoal = createAsyncThunk(
  "goals/createGoal",
  async (goalData, thunkAPI) => {
    try {
      const response = await api.post("/goals/", goalData);
      thunkAPI.dispatch(fetchGoals()); // refresh
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const goalsSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default goalsSlice.reducer;
