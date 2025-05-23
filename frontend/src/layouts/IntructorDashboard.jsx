import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

const NAVIGATION = [
{
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
},
{
    segment: 'student-list',
    title: 'Student List',
    icon: <PeopleIcon />,
},
{
    segment: 'gradebook',
    title: 'Gradebook',
    icon: <BarChartIcon />,
},
];

const demoTheme = createTheme({
cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
},
colorSchemes: { light: true, dark: true },
breakpoints: {
    values: {
    xs: 0,
    sm: 600,
    md: 600,
    lg: 1200,
    xl: 1536,
    },
},
});

function DemoPageContent({ pathname }) {
    const currentPage = pathname.split('/').pop();
  
    const renderComponent = () => {
      switch (currentPage) {
        case 'dashboard':
          return <ClassDashboard classes={[]} onSelectClass={() => {}} />;
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

// Remove this const when copying and pasting into your project.
const demoWindow = window !== undefined ? window() : undefined;

return (
    <DemoProvider window={demoWindow}>
    <AppProvider
        navigation={NAVIGATION}
        branding={{
            logo: <HistoryEduIcon alt="MUI logo" fontSize="large"/>,
            title: 'ClassPilot',
            homeUrl: '/toolpad/core/introduction',
        }}
        router={router}
        theme={demoTheme}
        window={demoWindow}
        >
        <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
    </AppProvider>
    </DemoProvider>
);
}

DashboardLayoutBasic.propTypes = {
/**
 * Injected by the documentation to work in an iframe.
 * Remove this when copying and pasting into your project.
 */
window: PropTypes.func,
};

export default DashboardLayoutBasic;