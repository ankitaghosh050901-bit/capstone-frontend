// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import activityImg from "../assets/image2.jpg";
import activityImg1 from "../assets/image3.jpg";
import activityImg2 from "../assets/images4.jpg";


export default function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to Your Fitness Dashboard
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        
        {/* CARD 1 - Navigate to /activities */}
        <Grid item xs={12} md={3}>
          <Card onClick={() => navigate('/activities')} sx={{ cursor: 'pointer', boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="140"
              image={activityImg}
              alt="Log your activities"
             sx={{ objectFit: "contain", padding: 0.3, backgroundColor: "#fff" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
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
  <Link to="/goals" style={{ textDecoration: 'none' }}>
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={activityImg1}
        alt="Set your fitness goals"
        sx={{ objectFit: "contain", padding: 1, backgroundColor: "#fff" }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
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
      <Card onClick={() => navigate("/Tracking")} sx={{ cursor: "pointer" }}> 
            <CardMedia
              component="img"
              height="140"
              image={activityImg2}
              alt="Visualize your progress"
              sx={{ objectFit: "contain", padding: 0, backgroundColor: "#fff" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
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
  );
}
