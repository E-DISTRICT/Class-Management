const User = require('../models/Instructor');
const Class = require('../models/Class');
const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      classes: user.classes,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }
  const user = await User.findOne({ email });
  const classes = await Class.find({ instructor: user._id });
  if(classes){
    for (const classItem of classes) {
      classItem.students = await Student.find({ classes: classItem._id });
    }
  }
  // if user does not exist
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  // compare password
  const token = user.createJWT();
  
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      classes: classes,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequest('Please provide all values');
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      classes: user.classes,
      token,
    },
  });
};

module.exports = {
  register,
  login,
  updateUser,
};
