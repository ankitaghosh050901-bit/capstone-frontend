import { Box, Typography, Button } from '@mui/material';

export default function Landing() {
  return (
    <Box display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="70vh"
    textAlign="center">
      <Typography variant="h3" gutterBottom>
        Welcome to the Fitness Tracker App 💪
      </Typography>
      <Typography variant="h6" gutterBottom>
        Set your fitness goals, track activities, and visualize progress.
      </Typography>
      <Box mt={4}>
        <Button variant="contained" color="primary" sx={{ mx: 2 }}>
          Get Started
        </Button>
        <Button variant="outlined" color="primary">
          Learn More
        </Button>
      </Box>
    </Box>
  );
}
