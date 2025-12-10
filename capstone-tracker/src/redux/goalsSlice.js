// src/redux/goalsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const goalsSlice = createSlice({
  name: "goals",
  initialState: {
    list: [], // [{id, step_goal, calorie_goal}]
  },
  reducers: {
    addGoal: (state, action) => {
      state.list.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    updateGoal: (state, action) => {
      const { id, step_goal, calorie_goal } = action.payload;
      const index = state.list.findIndex((g) => g.id === id);
      if (index !== -1) {
        state.list[index] = { id, step_goal, calorie_goal };
      }
    },
    deleteGoal: (state, action) => {
      state.list = state.list.filter((g) => g.id !== action.payload);
    },
  },
});

export const { addGoal, updateGoal, deleteGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
