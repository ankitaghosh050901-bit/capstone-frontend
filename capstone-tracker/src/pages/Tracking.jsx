// Tracking.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Fade,
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

import { fetchActivities } from "../redux/activitySlice";
import { fetchGoals } from "../redux/goalsSlice";
import { fetchProgress } from "../redux/progressSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Tracking() {
  const dispatch = useDispatch();

  const activities = useSelector((state) => state.activity.activities);
  const goals = useSelector((state) => state.goals.goals);
  const progress = useSelector((state) => state.progress);

  const today = new Date().toLocaleDateString("en-CA");

  const [dateFilter, setDateFilter] = useState("");
  const [durationDate, setDurationDate] = useState("");
  const [timeGroup, setTimeGroup] = useState("daily");
  const [calorieGroup, setCalorieGroup] = useState("daily");

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchGoals());
    dispatch(fetchProgress());
  }, [dispatch]);

  useEffect(() => {
    if (!activities.length) return;

    const dates = [...new Set(activities.map((a) => a.date))].sort();
    const defaultDate = dates.includes(today)
      ? today
      : dates[dates.length - 1];

    setDateFilter(defaultDate);
    setDurationDate(defaultDate);
  }, [activities, today]);

  /* ================= TODAY'S INSIGHT (✅ FIXED) ================= */

  const todayInsight = useMemo(() => {
    if (!activities.length) {
      return {
        title: "💡 Today’s Insight",
        message: "Log activities to unlock insights 📊",
        color: "#eeeeee",
      };
    }

    // ✅ compare DAILY TOTAL steps, not last rows
    const stepsByDate = {};
    activities.forEach((a) => {
      stepsByDate[a.date] =
        (stepsByDate[a.date] || 0) + Number(a.steps || 0);
    });

    const dates = Object.keys(stepsByDate).sort();
    if (dates.length < 2) {
      return {
        title: "💡 Today’s Insight",
        message: "Add at least 2 days of activity to compare 📈",
        color: "#eeeeee",
      };
    }

    const todayDate = dates[dates.length - 1];
    const yesterdayDate = dates[dates.length - 2];

    const todaySteps = stepsByDate[todayDate];
    const yesterdaySteps = stepsByDate[yesterdayDate];

    const stepDiff = todaySteps - yesterdaySteps;

    let message = "";
    let color = "#e3f2fd";

    if (stepDiff > 0) {
      message = `Great job! You walked ${stepDiff} more steps than yesterday 🚀`;
      color = "#e8f5e9";
    } else if (stepDiff < 0) {
      message = `You walked ${Math.abs(
        stepDiff
      )} fewer steps than yesterday. Let’s push today 💪`;
      color = "#fff3e0";
    } else {
      message = "Your activity level is consistent with yesterday 👌";
    }

    return {
      title: "💡 Today’s Insight",
      message,
      color,
    };
  }, [activities]);

  /* ================= CONSISTENCY SCORE (NEW) ================= */

  const consistency = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString("en-CA");
    });

    const activeDays = new Set(
      activities
        .filter((a) => last7Days.includes(a.date))
        .map((a) => a.date)
    );

    let streak = 0;
    for (let d of last7Days) {
      if (activeDays.has(d)) streak++;
      else break;
    }

    const score = Math.round((activeDays.size / 7) * 100);

    return { score, activeDays: activeDays.size, streak };
  }, [activities]);

  /* ================= DATA LOGIC ================= */

  const uniqueDates = [...new Set(activities.map((a) => a.date))].sort();

  const actualSteps = activities
    .filter((a) => a.date === dateFilter)
    .reduce((s, a) => s + Number(a.steps || 0), 0);

  const goalForDate = goals.find(
    (g) => (g.date || g.created_at)?.split("T")[0] === dateFilter
  );

  const goalSteps = goalForDate ? Number(goalForDate.step_goal) : 0;

  const donutData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [actualSteps, Math.max(goalSteps - actualSteps, 0)],
        backgroundColor: ["#00bcd4", "#ffe082"],
        borderWidth: 2,
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { animateScale: true, duration: 1200 },
  };

  const groupBy = (field, group) => {
    const grouped = {};
    activities.forEach((a) => {
      const d = new Date(a.date);
      let key;

      if (group === "daily") key = a.date;
      else if (group === "weekly")
        key = `${d.getFullYear()} W${Math.ceil((d.getDate() + 1) / 7)}`;
      else if (group === "monthly")
        key = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
      else key = `${d.getFullYear()}`;

      grouped[key] = (grouped[key] || 0) + Number(a[field] || 0);
    });
    return grouped;
  };

  const stepsGrouped = groupBy("steps", timeGroup);
  const caloriesGrouped = groupBy("calories_burned", calorieGroup);

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📊 Your Fitness Progress
      </Typography>

      <Fade in timeout={800}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            backgroundColor: todayInsight.color,
            borderLeft: "6px solid #42a5f5",
            boxShadow: 4,
          }}
        >
          <Typography variant="h6">{todayInsight.title}</Typography>
          <Typography sx={{ mt: 1 }}>{todayInsight.message}</Typography>
        </Paper>
      </Fade>

      {/* ✅ CONSISTENCY SCORE CARD */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
          borderLeft: "6px solid #4caf50",
          boxShadow: 4,
        }}
      >
        <Typography variant="h6">🔥 Consistency Score</Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>{consistency.score}%</strong> active this week
        </Typography>
        <Typography>Active Days: {consistency.activeDays} / 7</Typography>
        <Typography>
          Current Streak: <strong>{consistency.streak} days 🔥</strong>
        </Typography>
        <Typography sx={{ mt: 1, color: "#2e7d32" }}>
          {consistency.score >= 70
            ? "Excellent consistency! Keep it going 💪"
            : "Try to be more consistent this week 🚀"}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f1f8e9", boxShadow: 3 }}>
        <Typography>Total Activities: {progress.total_activities}</Typography>
        <Typography>Total Steps: {progress.total_steps}</Typography>
        <Typography>Total Calories: {progress.total_calories}</Typography>
      </Paper>

      {/* 🔹 ORIGINAL 4 CARDS */}
      <Grid container spacing={3}>
        {/* CARD 1 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,
              backgroundColor: "#e0f7fa",
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center">
              Daily Steps vs Goal
            </Typography>

            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Select Date</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {uniqueDates.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ height: 200 }}>
              <Doughnut data={donutData} options={donutOptions} />
            </Box>

            <Typography align="center">
              {actualSteps} / {goalSteps} steps
            </Typography>
          </Paper>
        </Grid>

        {/* CARD 2 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,
              backgroundColor: "#e3f2fd",
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center">
              Steps Trend
            </Typography>

            <ToggleButtonGroup
              value={timeGroup}
              exclusive
              onChange={(_, v) => v && setTimeGroup(v)}
              sx={{ my: 2, display: "flex", justifyContent: "center" }}
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ height: 220 }}>
              <Bar
                data={{
                  labels: Object.keys(stepsGrouped),
                  datasets: [
                    {
                      label: "Steps",
                      data: Object.values(stepsGrouped),
                      backgroundColor: "#42a5f5",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* CARD 3 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,
              backgroundColor: "#fce4ec",
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center">
              Activity Duration
            </Typography>

            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Select Date</InputLabel>
              <Select
                value={durationDate}
                onChange={(e) => setDurationDate(e.target.value)}
              >
                {uniqueDates.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ height: 220 }}>
              <Doughnut
                data={{
                  labels: activities
                    .filter((a) => a.date === durationDate)
                    .map((a) => a.activity_type),
                  datasets: [
                    {
                      data: activities
                        .filter((a) => a.date === durationDate)
                        .map((a) => a.duration),
                      backgroundColor: [
                        "#ec407a",
                        "#7e57c2",
                        "#26a69a",
                        "#ffa726",
                      ],
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* CARD 4 */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,
              backgroundColor: "#e8f5e9",
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center">
              🔥 Calories Burned
            </Typography>

            <ToggleButtonGroup
              value={calorieGroup}
              exclusive
              onChange={(_, v) => v && setCalorieGroup(v)}
              sx={{ my: 2, display: "flex", justifyContent: "center" }}
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ height: 220 }}>
              <Bar
                data={{
                  labels: Object.keys(caloriesGrouped),
                  datasets: [
                    {
                      label: "Calories",
                      data: Object.values(caloriesGrouped),
                      backgroundColor: "#4caf50",
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
