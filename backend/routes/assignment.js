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

const { createAssignment, getAssignment, updateAssignment, submitAssignment, deleteAssignment, getAllAssignments } = require('../controllers/assignment');
router.post('/createAssignment', apiLimiter, createAssignment);
router.get('/getAssignment/:classId/:assignmentId', getAssignment);
router.get('/getAllAssignments/:classId', authenticateUser, getAllAssignments);
router.patch('/updateAssignment/:id', authenticateUser, updateAssignment);
router.patch('/submitAssignment/:id', authenticateUser, apiLimiter, submitAssignment);
router.delete('/deleteAssignment/:id', authenticateUser, deleteAssignment);
module.exports = router;