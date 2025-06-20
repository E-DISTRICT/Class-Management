// components/instructor/ClassDashboard.jsx
import * as React from 'react';
import {
    Box,
    Drawer,
    Button,
    TextField,
    Typography,
    Stack,
    Card,
    CardContent,
    Grid,
    CssBaseline,
    CardActionArea,
    } from '@mui/material';

export default function ClassDashboard({ onSelectClass }) {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState('');
    const [grade, setGrade] = React.useState('');
    const instructorData = JSON.parse(localStorage.getItem('instructor'));
    const instructorId = instructorData?.id;
    const classes = instructorData?.classes || [];
    const [fetchedClasses, setFetchedClasses] = React.useState([]);

    const fetchClasses = async () => {
        try {
        const response = await fetch(`https://class-management-backend-uoxs.onrender.com/api/v1/classes/instructor/${instructorId}`);
        const data = await response.json();
        setFetchedClasses(data.classes); // adjust based on your API's return shape
        } catch (err) {
        console.error("Failed to fetch classes", err);
        }
    };

    React.useEffect(() => {
        fetchClasses();
    }, []);


    const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setOpen(open);
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('https://class-management-backend-uoxs.onrender.com/api/v1/classes/createClass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, grade, instructor: instructorId }),
        });
        if (!response.ok) {
        throw new Error('Failed to create class');
        }
        const result = await response.json();
        fetchClasses();
        console.log('Class created:', result);
        // Optional: refresh the class list or show confirmation
        setOpen(false);
        setName('');
        setGrade('');
    } catch (error) {
        console.error(error.message);
    }
    };

    const drawerContent = (
    <Box sx={{ width: 300, p: 3, mt: 8 }} role="presentation">
        <Typography variant="h6" gutterBottom>
        Create New Class
        </Typography>
        <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
            <TextField
            label="Class Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            />
            <TextField
            label="Grade Level"
            fullWidth
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            required
            />
            <Button type="submit" variant="contained" fullWidth>
            Submit
            </Button>
        </Stack>
        </form>
    </Box>
    );

    return (
    <>
    <CssBaseline />
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
    <Typography variant="h4">Dashboard</Typography>
    </Box>
    {/* Display classes as MUI cards */}
    <Box sx={{ px: 3 }}>
        {fetchedClasses.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            You haven’t created any classes yet.
        </Typography>
        ) : (
        <Grid container spacing={3}>
            {fetchedClasses.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls._id || cls.id}>
                <Card sx={{height: '120px', width: '200px'}}>
                <CardActionArea onClick={() => onSelectClass(cls)}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                    {cls.name}
                    </Typography>
                    <Typography color="text.secondary">
                    Grade: {cls.grade}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Students: {cls.students?.length || 0}
                    </Typography>
                </CardContent>
                </CardActionArea>
                </Card>
            </Grid>
            ))}
        </Grid>
        )}
        <Button sx={{mt:'20px'}} variant="contained" onClick={toggleDrawer(true)}>
        Add New Class
        </Button>
    </Box>

    {/* Drawer for creating a new class */}
    <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        {drawerContent}
    </Drawer>
    </>
    );
}
