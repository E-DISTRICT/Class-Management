import React from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  CssBaseline,
  useMediaQuery,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const navigate = useNavigate();

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const [form, setForm] = React.useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    location: '',
  });

  const [isInstructor, setIsInstructor] = React.useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setIsInstructor((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userType = isInstructor ? 'instructor' : 'student';

    try {
      const response = await fetch(`http://class-management-backend.onrender.com/api/v1/${userType}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Registration failed: ${error.msg || 'Unknown error'}`);
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.user.token);
      localStorage.setItem(userType, JSON.stringify(data.user));

      navigate(isInstructor ? '/instructor' : '/student');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Something went wrong during registration.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: 400,
          mx: 'auto',
          mt: 8,
          px: 3,
          py: 4,
          boxShadow: 3,
          borderRadius: 2,
          border: '0.5px solid',
          borderColor: 'darkgrey',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Register as {isInstructor ? 'Instructor' : 'Student'}
        </Typography>
        <FormControlLabel
          control={<Switch checked={isInstructor} onChange={handleToggle} />}
          label="Register as Instructor"
          sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
        />
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="name"
            fullWidth
            required
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            margin="normal"
            value={form.lastName}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="normal"
            value={form.location}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
