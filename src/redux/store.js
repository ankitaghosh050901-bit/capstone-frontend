import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import activityReducer from "./activitySlice";
import goalsReducer from './goalsSlice';
import progressReducer from "./progressSlice"; 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    activity: activityReducer,
     goals: goalsReducer,
     progress: progressReducer,
  },
});
