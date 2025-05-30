import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InstructorDashboard from './layouts/IntructorDashboard';
import StudentDashboard from './layouts/StudentDashboard';
import SignIn from './layouts/SignIn';

function App() {

 

  return (
    <Router>
      <Routes>
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;
