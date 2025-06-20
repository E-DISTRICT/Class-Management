const Class = require('../models/Class');
const Instructor = require('../models/Instructor');
const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const createClass = async (req, res) => {
  const course = await Class.create({ ...req.body });
  await Instructor.findByIdAndUpdate(course.instructor, {
    $push: { classes: course._id }
  });

  res.status(StatusCodes.CREATED).json({
    course: {
      name: course.name,
      grade: course.grade,
      instructor: course.instructor,
    },
  });
};

const getInstructorClasses = async (req, res) => {
  const { id } = req.params;
  const classes = await Class.find({ instructor: id });
  res.status(StatusCodes.OK).json({ classes });
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

const enrollStudent = async (req, res) => {
  const { classId } = req.body;
  const studentId = req.user.userId; // or req.body.studentId if not using auth

  const student = await Student.findById(studentId);
  const classObj = await Class.findById(classId);

  if (!student || !classObj) {
    return res.status(404).json({ msg: 'Student or class not found' });
  }

  if (!student.classes.includes(classId)) {
    student.classes.push(classId);
    await student.save();
  }

  if (!classObj.students.includes(studentId)) {
    classObj.students.push(studentId);
    await classObj.save();
  }

  res.status(200).json({ msg: 'Enrolled successfully' });
};

const getAvailableClasses = async (req, res) => {
  const studentId = req.user.userId;
  const student = await Student.findById(studentId);

  const availableClasses = await Class.find({ _id: { $nin: student.classes } });

  res.status(StatusCodes.OK).json({ classes: availableClasses });
};

const getStudentClasses = async (req, res) => {
  const { id } = req.params;

  const student = await Student.findById(id).populate('classes');

  if (!student) {
    return res.status(404).json({ msg: 'Student not found' });
  }

  res.status(StatusCodes.OK).json({ classes: student.classes });
};


module.exports = {
    createClass,
    getClass,
    updateClass,
    getInstructorClasses,
    enrollStudent,
    getAvailableClasses,
    getStudentClasses
};
