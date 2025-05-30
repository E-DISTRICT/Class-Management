const Class = require('../models/Class');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const createClass = async (req, res) => {
  const course = await Class.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    course: {
      name: course.name,
      grade: course.grade,
      instructor: course.instructor,
    },
  });
};

const getClass = async (req, res) => {
  const { id } = req.params;

  const course = await Class.findOne({ _id: id });
  if (!course) {
    throw new BadRequestError('Course not found');
  }

  res.status(StatusCodes.OK).json({
    course: {
      name: course.name,
      grade: course.grade,
      instructor: course.instructor,
    },
  });
};

const updateClass = async (req, res) => {
  const { name, grade, instructor } = req.body;
  if (!name || !grade || !instructor) {
    throw new BadRequest('Please provide all values');
  }
  const course = await Class.findOne({ _id: req.params.id });

  course.name = name;
  course.grade = grade;
  course.instructor = instructor;

  await course.save();
  res.status(StatusCodes.OK).json({
    course: {
      name: course.name,
      grade: course.grade,
      instructor: course.instructor,
    },
  });
};

module.exports = {
    createClass,
    getClass,
    updateClass
};
