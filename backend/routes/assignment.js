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
router.get('/getAssignment/:classId/:assignmentId', apiLimiter, getAssignment);
router.get('/getAllAssignments/:classId', apiLimiter, getAllAssignments);
router.patch('/updateAssignment/:id', apiLimiter, updateAssignment);
router.patch('/submitAssignment/:id', apiLimiter, submitAssignment);
router.delete('/deleteAssignment/:id', apiLimiter, deleteAssignment);
module.exports = router;