const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');


const rateLimiter = require('express-rate-limit');

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

const { getStudentsInClass } = require('../controllers/classStudents');
const { createClass, getClass, updateClass, getInstructorClasses, enrollStudent, getAvailableClasses, getStudentClasses } = require('../controllers/classes');
router.post('/createClass', apiLimiter, createClass);
router.get('/getClass/:id', apiLimiter, getClass);
router.get('/instructor/:id', getInstructorClasses);
router.patch('/updateClass/:id', authenticateUser, updateClass);
router.get('/students/:classId', getStudentsInClass);
router.post('/enroll', authenticateUser, enrollStudent);
router.get('/available', authenticateUser, getAvailableClasses);
router.get('/student/:id', getStudentClasses);
module.exports = router;