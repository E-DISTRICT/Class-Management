import React, { useEffect, useState } from 'react';
import {
Box,
Typography,
Button,
Drawer,
TextField,
Stack,
Card,
CardContent,
Grid,
} from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';


export default function ClassView({ selectedClass, onBack }) {
const [students, setStudents] = useState([]);
const [editMode, setEditMode] = useState(false);
const [editingId, setEditingId] = useState(null);
const [assignments, setAssignments] = useState([]);
const [drawerOpen, setDrawerOpen] = useState(false);
const [newAssignment, setNewAssignment] = useState({
name: '',
description: '',
dueDate: '',
});

const locales = {
'en-US': enUS,
};

const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek,
getDay,
locales,
});


useEffect(() => {
const fetchStudents = async () => {
try {
    const res = await fetch(`https://class-management-backend.onrender.com/api/v1/classes/students/${selectedClass._id}`);
    const data = await res.json();
    setStudents(data.students || []);
} catch (err) {
    console.error("Failed to fetch students", err);
}
};

fetchStudents();
}, [selectedClass]);

const events = assignments.map((assignment) => ({
title: assignment.name,
start: new Date(assignment.dueDate),
end: new Date(assignment.dueDate),
allDay: true,
resource: assignment, // optional, gives access to the full assignment
}));

const fetchAssignments = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(
      `https://class-management-backend.onrender.com/api/v1/assignment/getAllAssignments/${selectedClass._id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const data = await response.json();
    setAssignments(data.assignments || []);
  } catch (err) {
    console.error('Failed to fetch assignments', err);
  }
};

useEffect(() => {
fetchAssignments();
}, [selectedClass]);

const handleCreateAssignment = async () => {
try {
const response = await fetch('https://class-management-backend.onrender.com/api/v1/assignment/createAssignment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
    ...newAssignment,
    classes: selectedClass._id,
    }),
});
if (!response.ok) throw new Error('Failed to create assignment');

await response.json();
fetchAssignments();
setDrawerOpen(false);
setNewAssignment({ name: '', description: '', dueDate: '' });
} catch (error) {
console.error(error.message);
}
};

const handleUpdateAssignment = async () => {
const token = localStorage.getItem('token');
try {
    const response = await fetch(`https://class-management-backend.onrender.com/api/v1/assignment/updateAssignment/${editingId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, },
    body: JSON.stringify({
        name: newAssignment.name,
        description: newAssignment.description,
        dueDate: newAssignment.dueDate,
    }),
    });
    if (!response.ok) throw new Error('Failed to update assignment');

    await response.json();
    fetchAssignments();
    setDrawerOpen(false);
    setEditMode(false);
    setEditingId(null);
    setNewAssignment({ name: '', description: '', dueDate: '' });
} catch (error) {
    console.error(error.message);
}
};

const handleDeleteAssignment = async (id) => {
if (!window.confirm('Are you sure you want to delete this assignment?')) return;

const token = localStorage.getItem('token');

    try {
    const response = await fetch(`https://class-management-backend.onrender.com/api/v1/assignment/deleteAssignment/${id}`, {
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to delete assignment');
    await response.json();
    fetchAssignments();
} catch (error) {
    console.error(error.message);
}
};


return (
<Box sx={{ p: 3 }}>
    <Typography variant="h4">{selectedClass.name}</Typography>
    <Typography variant="subtitle1">Grade: {selectedClass.grade}</Typography>
    <Typography variant="subtitle2">
    Students: {selectedClass.students?.length || 0}
    </Typography>

    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
    <Typography variant="h5">Assignments</Typography>
    <Button
    variant="contained"
    onClick={() => {
        setDrawerOpen(true);
        setEditMode(false);
        setNewAssignment({ name: '', description: '', dueDate: '' });
    }}
    >
    Create Assignment
    </Button>
    </Box>

    {assignments.length === 0 ? (
    <Typography sx={{ mt: 2 }}>No assignments created yet.</Typography>
    ) : (
    <Grid container spacing={2} sx={{ mt: 2 }}>
        {assignments.map((assignment, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
            <CardContent>
                <Typography variant="h6">{assignment.name}</Typography>
                <Typography>{assignment.description}</Typography>
                <Typography variant="body2" color="text.secondary">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                Submissions: {assignment.completedStudents?.length || 0}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                    size="small"
                    onClick={() => {
                        console.log("Editing assignment:", assignment);
                        setDrawerOpen(true);
                        setEditMode(true);
                        setEditingId(assignment._id);
                        setNewAssignment({
                        name: assignment.name,
                        description: assignment.description,
                        dueDate: assignment.dueDate.slice(0, 10), // input date format
                        });
                    }}
                    >
                    Edit
                    </Button>
                    <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteAssignment(assignment._id)}
                    >
                    Delete
                    </Button>
                </Box>
            </CardContent>
            </Card>
        </Grid>
        ))}
    </Grid>
    )}
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

    <Box sx={{ mt: 6 }}>
    <Typography variant="h5" gutterBottom>Students</Typography>
    {students.length === 0 ? (
    <Typography>No students enrolled.</Typography>
    ) : (
    <Box>
    {students.map((student) => (
        <Box key={student._id} sx={{ mb: 1 }}>
        <Typography>
            {student.name} {student.lastName} — <em>{student.email}</em>
        </Typography>
        </Box>
    ))}
    </Box>
    )}
    </Box>


    <Box sx={{ mt: 4 }}>
    <Button onClick={onBack} variant="outlined">
        Back to Dashboard
    </Button>
    </Box>

    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
    <Box sx={{ width: 300, p: 3, mt: 8 }}>
        <Typography variant="h6" gutterBottom>
        New Assignment
        </Typography>
        <form
        onSubmit={(e) => {
            e.preventDefault();
            if (editMode) {
            handleUpdateAssignment();
            } else {
            handleCreateAssignment();
            }
        }}
        >
        <Stack spacing={2}>
            <TextField
            label="Assignment Name"
            fullWidth
            required
            value={newAssignment.name}
            onChange={(e) =>
                setNewAssignment({ ...newAssignment, name: e.target.value })
            }
            />
            <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            required
            value={newAssignment.description}
            onChange={(e) =>
                setNewAssignment({ ...newAssignment, description: e.target.value })
            }
            />
            <TextField
            label="Due Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            value={newAssignment.dueDate}
            onChange={(e) =>
                setNewAssignment({ ...newAssignment, dueDate: e.target.value })
            }
            />
            <Button type="submit" variant="contained" fullWidth>
            Create
            </Button>
        </Stack>
        </form>
    </Box>
    </Drawer>
</Box>
);
}
