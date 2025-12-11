// Tracking.jsx
import React, { useEffect, useState } from "react";
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

  const [dateFilter, setDateFilter] = useState("");
  const [durationDate, setDurationDate] = useState(""); // NEW
  const [timeGroup, setTimeGroup] = useState("daily");

  useEffect(() => {
    dispatch(fetchActivities());
    dispatch(fetchGoals());
    dispatch(fetchProgress());
  }, [dispatch]);

  const uniqueDates = Array.from(new Set(activities.map((a) => a.date))).sort();

  const actualSteps =
    dateFilter && activities.length
      ? activities
          .filter((a) => a.date === dateFilter)
          .reduce((sum, a) => sum + Number(a.steps || 0), 0)
      : 0;

  const goalForDate = dateFilter
    ? goals.find(
        (g) => (g.date || g.created_at)?.split("T")[0] === dateFilter
      )
    : null;

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

  // ---------------- BAR CHART ----------------
  const groupSteps = () => {
    const grouped = {};

    activities.forEach((a) => {
      const d = new Date(a.date);
      let key;

      if (timeGroup === "daily") key = a.date;
      else if (timeGroup === "weekly") {
        const week = Math.ceil((d.getDate() + 1) / 7);
        key = `${d.getFullYear()} W${week}`;
      } else if (timeGroup === "monthly")
        key = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
      else key = `${d.getFullYear()}`;

      grouped[key] = (grouped[key] || 0) + Number(a.steps || 0);
    });

    return grouped;
  };

  const barGrouped = groupSteps();

  const barData = {
    labels: Object.keys(barGrouped).sort(),
    datasets: [
      {
        label: "Steps",
        data: Object.keys(barGrouped)
          .sort()
          .map((k) => barGrouped[k]),
        backgroundColor: "#42a5f5",
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000 },
    scales: { y: { beginAtZero: true } },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { animateScale: true, duration: 1200 },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        📊 Your Fitness Progress
      </Typography>

      {/* Overview */}
      <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f1f8e9", boxShadow: 3 }}>
        <Typography>Total Activities: {progress.total_activities}</Typography>
        <Typography>Total Steps: {progress.total_steps}</Typography>
        <Typography>Total Calories: {progress.total_calories}</Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* ----------- CARD 1 ------------ */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,   // UPDATED SAME HEIGHT
              backgroundColor: "#e0f7fa",
              borderRadius: 2,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Daily Steps vs Goal
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Date</InputLabel>
              <Select
                value={dateFilter}
                label="Select Date"
                onChange={(e) => setDateFilter(e.target.value)}
              >
                {uniqueDates.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {dateFilter && (
              <Box sx={{ height: 200 }}>
                <Doughnut data={donutData} options={donutOptions} />
              </Box>
            )}

            {dateFilter && (
              <Typography align="center" sx={{ mt: 2 }}>
                {actualSteps} / {goalSteps} steps
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* ----------- CARD 2 ------------ */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,   // UPDATED SAME HEIGHT
              backgroundColor: "#e3f2fd",
              borderRadius: 2,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              {`Steps Trend (${timeGroup})`}
            </Typography>

            <Box textAlign="center" sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={timeGroup}
                exclusive
                onChange={(_, v) => v && setTimeGroup(v)}
              >
                <ToggleButton value="daily">DAILY</ToggleButton>
                <ToggleButton value="weekly">WEEKLY</ToggleButton>
                <ToggleButton value="monthly">MONTHLY</ToggleButton>
                <ToggleButton value="yearly">YEARLY</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ height: 200 }}>
              <Bar data={barData} options={barOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* ----------- CARD 3 ------------ */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              height: 420,   // SAME HEIGHT AS OTHERS
              backgroundColor: "#fce4ec",
              borderRadius: 2,
              boxShadow: 4,
            }}
          >
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Activity Duration Breakdown
            </Typography>

            {/* Date Select */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Date</InputLabel>
              <Select
                value={durationDate}
                label="Select Date"
                onChange={(e) => setDurationDate(e.target.value)}
              >
                {uniqueDates.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtered Chart */}
            {durationDate &&
              (() => {
                const filtered = activities.filter(
                  (a) => a.date === durationDate
                );

                const typeDurations = {};
                filtered.forEach((a) => {
                  const type = a.activity_type || "Unknown";
                  typeDurations[type] =
                    (typeDurations[type] || 0) + Number(a.duration || 0);
                });

                const pieData = {
                  labels: Object.keys(typeDurations),
                  datasets: [
                    {
                      data: Object.values(typeDurations),
                      backgroundColor: [
                        "#ec407a",
                        "#7e57c2",
                        "#26a69a",
                        "#ffa726",
                      ],
                      borderWidth: 2,
                    },
                  ],
                };

                return (
                  <>
                    <Box sx={{ height: 220 }}>
                      <Doughnut data={pieData} options={pieOptions} />
                    </Box>

                    <Typography align="center" sx={{ mt: 2, fontWeight: 600 }}>
                      Total Duration:{" "}
                      {Object.values(typeDurations).reduce(
                        (a, b) => a + b,
                        0
                      )}{" "}
                      minutes
                    </Typography>
                  </>
                );
              })()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
