// src/redux/activitySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api"; // axios with auth

// Fetch activities from backend
export const fetchActivities = createAsyncThunk(
  "activity/fetchActivities",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/logs/");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create activity (optional)
export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async (activityData, thunkAPI) => {
    try {
      const response = await api.post("/logs/", activityData);
      // automatically refresh
      thunkAPI.dispatch(fetchActivities());
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createActivity.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default activitySlice.reducer;
