// src/pages/Home.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

import bgImage from "../assets/image1.jpg";
import activityImg from "../assets/image2.jpg";
import activityImg1 from "../assets/image3.jpg";
import activityImg2 from "../assets/images4.jpg";

export default function Home() {
  const navigate = useNavigate();

  const cardStyle = {
    cursor: "pointer",
    borderRadius: 4, // ✅ curved cards
    boxShadow: 6,
    background: "linear-gradient(135deg, #ffffff 0%, #f3f6ff 100%)", // ✅ soft gradient
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: 10,
    },
  };

  return (
    <>
      {/* Full screen background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: -1,
        }}
      />

      {/* Page content */}
      <Box sx={{ textAlign: "center", pt: 11 }}>
        <Typography
          variant="h4"
          gutterBottom
          color="white"
          sx={{ fontWeight: 700 }}   // ✅ bold heading
        >
          Welcome to Your Fitness Dashboard
        </Typography>

        <Grid container spacing={8} justifyContent="center" sx={{ mt: 2 }}>
          
          {/* CARD 1 */}
          <Grid item xs={12} md={3}>
            <Card sx={cardStyle} onClick={() => navigate('/activities')}>
              <CardMedia
                component="img"
                height="140"
                image={activityImg}
                sx={{ objectFit: "contain", p: 1 ,}}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Log your activities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Easily log workouts, runs, or yoga sessions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* CARD 2 */}
          <Grid item xs={12} md={3}>
            <Link to="/goals" style={{ textDecoration: "none" }}>
              <Card sx={cardStyle}>
                <CardMedia
                  component="img"
                  height="140"
                  image={activityImg1}
                  sx={{ objectFit: "contain", p: 1 }}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={600}>
                    Set your fitness goals
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Log meals and keep an eye on calories & macros.
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>

          {/* CARD 3 */}
          <Grid item xs={12} md={3}>
            <Card sx={cardStyle} onClick={() => navigate("/Tracking")}>
              <CardMedia
                component="img"
                height="140"
                image={activityImg2}
                sx={{ objectFit: "contain", p: 1 }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  Visualize your progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See charts and summaries of your fitness journey.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </>
  );
}
