import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Drawer, Grid,
  Card, CardContent, CardActionArea, CssBaseline
} from '@mui/material';
import StudentClassView from './studentClassView.jsx' // You'll need to create this

export default function MyClasses() {
  const studentData = JSON.parse(localStorage.getItem('student') || '{}');
  const studentId = studentData?.id;

  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null); // NEW

  const fetchEnrolledClasses = async () => {
    if (!studentId) return console.warn('No student ID found.');
    try {
      const res = await fetch(`https://class-management-backend-uoxs.onrender.com/api/v1/classes/student/${studentId}`);
      const data = await res.json();
      setEnrolledClasses(data.classes || []);
    } catch (err) {
      console.error("Failed to fetch enrolled classes", err);
    }
  };

  const fetchAvailableClasses = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://class-management-backend-uoxs.onrender.com/api/v1/classes/available', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setAvailableClasses(data.classes || []);
    } catch (err) {
      console.error('Failed to fetch available classes:', err);
    }
  };

  const enrollInClass = async (classId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://class-management-backend-uoxs.onrender.com/api/v1/classes/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ classId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.msg || 'Failed to enroll');

      console.log('Enrolled successfully:', result.msg);

      await fetchEnrolledClasses();
      await fetchAvailableClasses();
    } catch (err) {
      console.error('Enrollment failed:', err.message);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchEnrolledClasses();
    }
  }, [studentId]);

  // 🔁 If a class is selected, show StudentClassView
  if (selectedClass) {
    return (
      <StudentClassView
        selectedClass={selectedClass}
        onBack={() => setSelectedClass(null)} // Reset to show the list again
      />
    );
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
        <Typography variant="h4">My Classes</Typography>
      </Box>

      <Box sx={{ px: 3 }}>
        {enrolledClasses.length === 0 ? (
          <Typography>You are not enrolled in any classes yet.</Typography>
        ) : (
          <Grid container spacing={3}>
            {enrolledClasses.map((cls) => (
              <Grid item xs={12} sm={6} md={4} key={cls._id}>
                <Card sx={{ height: '120px', width: '200px' }}>
                  <CardActionArea onClick={() => setSelectedClass(cls)}>
                    <CardContent>
                      <Typography variant="h6">{cls.name}</Typography>
                      <Typography color="text.secondary">Grade: {cls.grade}</Typography>
                      <Typography color="text.secondary">
                        Students: {cls.students?.length || 0}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Button sx={{mt:'20px'}} variant="contained" onClick={() => {
          fetchAvailableClasses();
          setDrawerOpen(true);
        }}>
          Enroll in Class
        </Button>
      </Box>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 3, mt: 8 }}>
          <Typography variant="h6" gutterBottom>Available Classes</Typography>
          {availableClasses.length === 0 ? (
            <Typography>No available classes to join.</Typography>
          ) : (
            availableClasses.map((cls) => (
              <Card key={cls._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">{cls.name}</Typography>
                  <Typography variant="body2">Grade: {cls.grade}</Typography>
                  <Button variant="outlined" size="small" onClick={() => enrollInClass(cls._id)}>
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Drawer>
    </>
  );
}
