import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
  {
    segment: 'my-classes',
    title: 'My Classes',
    icon: <SchoolIcon />,
  },
  {
    segment: 'assignments',
    title: 'Assignments',
    icon: <AssignmentIcon />,
  },
  {
    segment: 'grades',
    title: 'Grades',
    icon: <GradeIcon />,
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