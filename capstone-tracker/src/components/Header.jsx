// src/components/Header.jsx
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');   // navigate to landing or homepage
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          Fitness Tracker
        </Typography>

        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate('/home')}>Home</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
