import React, { useEffect, useState } from 'react';
import {
Box,
Typography,
Button,
Grid,
Card,
CardContent
} from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

export default function StudentClassView({ selectedClass, onBack }) {
const [assignments, setAssignments] = useState([]);
const [completedIds, setCompletedIds] = useState([]);

const fetchAssignments = async () => {
const token = localStorage.getItem('token');
try {
    const response = await fetch(
    `https://class-management-backend.onrender.com/api/v1/assignment/getAllAssignments/${selectedClass._id}`,
    {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    }
    );
    const data = await response.json();
    setAssignments(data.assignments || []);
} catch (err) {
    console.error('Failed to fetch assignments', err);
}
};

useEffect(() => {
fetchAssignments();
}, [selectedClass]);

const markAsComplete = (assignmentId) => {
setCompletedIds((prev) => [...prev, assignmentId]);
};

const events = assignments.map((a) => ({
title: a.name,
start: new Date(a.dueDate),
end: new Date(a.dueDate),
allDay: true,
}));

return (
<Box sx={{ p: 3 }}>
    <Typography variant="h4">{selectedClass.name}</Typography>
    <Typography variant="subtitle1">Grade: {selectedClass.grade}</Typography>

    <Box sx={{ mt: 4 }}>
    <Typography variant="h5">Assignments</Typography>
    {assignments.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No assignments yet.</Typography>
    ) : (
        <Grid container spacing={2} sx={{ mt: 2 }}>
        {assignments.map((assignment, index) => {
            const isCompleted = completedIds.includes(assignment._id);
            return (
            <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                <CardContent>
                    <Typography variant="h6">{assignment.name}</Typography>
                    <Typography>{assignment.description}</Typography>
                    <Typography variant="body2" color="text.secondary">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {isCompleted ? (
                        <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DoneAllIcon />}
                        disabled
                        >
                        Completed
                        </Button>
                    ) : (
                        <Button
                        size="small"
                        variant="outlined"
                        onClick={() => markAsComplete(assignment._id)}
                        >
                        Mark as Complete
                        </Button>
                    )}
                    </Box>
                </CardContent>
                </Card>
            </Grid>
            );
        })}
        </Grid>
    )}
    </Box>

    <Box sx={{ mt: 6 }}>
    <Typography variant="h5" gutterBottom>
        Class Calendar
    </Typography>
    <div style={{ height: 500 }}>
        <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultView="month"
        views={['month', 'week', 'day']}
        popup
        style={{ height: '100%', border: '1px solid #ccc', borderRadius: 8 }}
        />
    </div>
    </Box>

    <Box sx={{ mt: 4 }}>
    <Button onClick={onBack} variant="outlined">
        Back to My Classes
    </Button>
    </Box>
</Box>
);
}
