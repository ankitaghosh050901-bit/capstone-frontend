import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'sticky',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
        p: 2,
        bgcolor: 'primary.main',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Typography variant="body2">© 2025 Fitness Tracker</Typography>
    </Box>
  );
}
