import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import {
  CssBaseline,
  Typography,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const providers = [{ id: 'credentials', name: 'Email and Password' }];

export default function SlotPropsSignIn() {
  const navigate = useNavigate();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [userType, setUserType] = React.useState('instructor');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  const RegisterLink = () => (
    <Typography variant="body2" sx={{ mt: 1 }}>
      Don’t have an account?{' '}
      <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
        Register here
      </Link>
    </Typography>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider theme={theme}>
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6 }}>
          {/* 🟢 This will appear above the SignInPage */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              label="User Type"
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="instructor">Instructor</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </Select>
          </FormControl>

          <SignInPage
            signIn={async (provider, formData) => {
              if (provider.id === 'credentials') {
                const email = formData.get('email');
                const password = formData.get('password');

                try {
                  const response = await fetch(
                    `http://class-management-backend.onrender.com/api/v1/${userType}/login`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, password }),
                    }
                  );

                  if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Login failed: ${errorData.msg || 'Unknown error'}`);
                    return;
                  }

                  const data = await response.json();
                  console.log(`${userType} logged in:`, data);

                  localStorage.setItem('token', data.user.token);
                  localStorage.setItem(userType, JSON.stringify(data.user));

                  navigate(userType === 'instructor' ? '/instructor' : '/student');
                } catch (error) {
                  console.error('Login error:', error);
                  alert('Something went wrong during login.');
                }
              }
            }}
            providers={providers}
            slots={{
              rememberMe: RegisterLink,
            }}
            slotProps={{
              form: { noValidate: true },
              emailField: { variant: 'standard' },
              passwordField: { variant: 'standard' },
              submitButton: { variant: 'contained' },
            }}
          />
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}
