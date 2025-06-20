import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstructorDashboard from './layouts/IntructorDashboard';
import StudentDashboard from './layouts/StudentDashboard';
import SignIn from './layouts/SignIn';
import RegisterPage from './layouts/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
