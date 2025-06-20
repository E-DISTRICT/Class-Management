import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme } from '@mui/material/styles';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import ClassDashboard from '../components/instructor/ClassDashboard';
import StudentList from '../components/instructor/StudentList';
import Gradebook from '../components/instructor/Gradebook';
import ClassView from '../components/instructor/ClassView';

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  // { segment: 'student-list', title: 'Student List', icon: <PeopleIcon /> },
  // { segment: 'gradebook', title: 'Gradebook', icon: <BarChartIcon /> },
];

const demoTheme = createTheme({
  cssVariables: { colorSchemeSelector: 'data-toolpad-color-scheme' },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

function DemoPageContent({ pathname }) {
  const currentPage = pathname.split('/').pop();
  const [selectedClass, setSelectedClass] = React.useState(null);

  const renderComponent = () => {
    if (selectedClass) {
      return (
        <ClassView
          selectedClass={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <ClassDashboard onSelectClass={setSelectedClass} />;
      case 'student-list':
        return <StudentList students={[]} />;
      case 'gradebook':
        return <Gradebook students={[]} assignments={[]} />;
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
  const router = useDemoRouter('/dashboard');
  const navigate = useNavigate();
  const demoWindow = window !== undefined ? window() : undefined;

  const instructorData = JSON.parse(localStorage.getItem('instructor')) || {};
  const name = instructorData?.name || 'Instructor';

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('instructor');
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
