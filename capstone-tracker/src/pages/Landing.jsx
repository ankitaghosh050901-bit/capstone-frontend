import { Box, Typography, Button } from '@mui/material';
import bgImage from "../assets/image1.jpg";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
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

        zIndex: 0,   // ✅ FIXED (was -1)
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to the Fitness Tracker App 💪
      </Typography>

      <Typography variant="h6" gutterBottom>
        Set your fitness goals, track activities, and visualize progress.
      </Typography>

      <Box mt={4}>
        <Button
          variant="contained"
          sx={{ mx: 2 }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>

        <Button
          variant="outlined"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
