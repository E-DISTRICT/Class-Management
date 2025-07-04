import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import AssignmentList from '../components/student/AssignmentList';
import GradeView from '../components/student/GradeView';
import MyClasses from '../components/student/MyClasses';

const NAVIGATION = [
  { segment: 'my-classes', title: 'My Classes', icon: <SchoolIcon /> },
  // { segment: 'assignments', title: 'Assignments', icon: <AssignmentIcon /> },
  // { segment: 'grades', title: 'Grades', icon: <GradeIcon /> },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function DemoPageContent({ pathname }) {
  const currentPage = decodeURIComponent(pathname.split('/').pop());

  const renderComponent = () => {
    switch (currentPage) {
      case 'my-classes':
        return <MyClasses classes={[]} />;
      case 'assignments':
        return <AssignmentList assignments={[]} />;
      case 'grades':
        return <GradeView grades={[]} />;
      default:
        return <Typography variant="h6">Welcome to ClassPilot!</Typography>;
    }
  };

  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {renderComponent()}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter('/my-classes');
  const navigate = useNavigate();
  const demoWindow = window !== undefined ? window() : undefined;

  const studentData = JSON.parse(localStorage.getItem('student')) || {};
  const name = studentData?.name || 'Student';

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/');
  };

  return (
    <DemoProvider window={demoWindow}>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: <HistoryEduIcon alt="MUI logo" fontSize="large" />,
          title: 'ClassPilot',
          homeUrl: '/toolpad/core/introduction',
        }}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 3,
              py: 2,
              backgroundColor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6">Welcome, {name}</Typography>
            <Button variant="outlined" color="error" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Box>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </DemoProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
