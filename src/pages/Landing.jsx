import { Box, Typography, Button } from '@mui/material';
import bgImage from "../assets/image1.jpg";

export default function Landing() {
  return (
    <Box
      sx={{
        position: "fixed",   // ⭐ ignores parent container padding
        top: 0,
        left: 0,

        width: "100vw",
        height: "100vh",

        m: 0,
        p: 0,
        overflow: "hidden",

        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "white",
        zIndex: -1,   // ⭐ keeps header & footer visible
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to the Fitness Tracker App 💪
      </Typography>

      <Typography variant="h6" gutterBottom>
        Set your fitness goals, track activities, and visualize progress.
      </Typography>

      <Box mt={4}>
        <Button variant="contained" sx={{ mx: 2 }}>Get Started</Button>
        <Button variant="outlined">Learn More</Button>
      </Box>
    </Box>
  );
}
