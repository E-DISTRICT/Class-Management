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

const { createClass, getClass, updateClass } = require('../controllers/classes');
router.post('/createClass', apiLimiter, createClass);
router.get('/getClass/:id', apiLimiter, getClass);
router.patch('/updateClass/:id', authenticateUser, updateClass);
module.exports = router;