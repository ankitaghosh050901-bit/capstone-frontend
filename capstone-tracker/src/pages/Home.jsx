// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';


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
              image="https://via.placeholder.com/300x140?text=Log+Activities"
              alt="Log your activities"
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
        image="https://via.placeholder.com/300x140?text=Set+Goals"
        alt="Set your fitness goals"
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
          <Card>
            <CardMedia
              component="img"
              height="140"
              image="https://via.placeholder.com/300x140?text=Track+Progress"
              alt="Visualize your progress"
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
