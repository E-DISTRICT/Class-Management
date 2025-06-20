const Assignment = require('../models/Assignment');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const createAssignment = async (req, res) => {
  const assignment = await Assignment.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({
    assignment: {
      name: assignment.name,
      description: assignment.description,
      dueDate: assignment.dueDate,
    },
  });
};

const getAssignment = async (req, res) => {
  const { classId, assignmentId } = req.params;

  const assignment = await Assignment.findOne({ _id: assignmentId, classes: classId });
  if (!assignment) {
    throw new BadRequestError('Assignment not found');
  }

  res.status(StatusCodes.OK).json({
    assignment: {
      name: assignment.name,
      description: assignment.description,
      completedStudents: assignment.completedStudents,
      dueDate: assignment.dueDate,
    },
  });
};

const getAllAssignments = async (req, res) => {
  const { classId } = req.params;

  const assignments = await Assignment.find({ classes: classId });

  res.status(StatusCodes.OK).json({
    assignments: assignments.map(assignment => ({
      _id: assignment._id,
      name: assignment.name,
      description: assignment.description,
      completedStudents: assignment.completedStudents,
      dueDate: assignment.dueDate,
    })),
  });
};


const updateAssignment = async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;
    if (!name || !description || !dueDate) {
      throw new BadRequestError('Please provide all values');
    }

    const assignment = await Assignment.findOne({ _id: req.params.id }).populate('classes');

    if (!assignment) {
      throw new BadRequestError('Assignment not found');
    }
    if (assignment.classes.instructor.toString() !== req.user.userId) {
      throw new UnauthenticatedError('Not authorized to update this assignment');
    }

    assignment.name = name;
    assignment.description = description;
    assignment.dueDate = dueDate;

    await assignment.save();

    res.status(StatusCodes.OK).json({
      assignment: {
        name: assignment.name,
        description: assignment.description,
        completedStudents: assignment.completedStudents,
        dueDate: assignment.dueDate,
      },
    });
  } catch (error) {
    console.error("Update assignment error:", error); // ✅ helps debug
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const submitAssignment = async (req, res) => {
  const studentId = req.user.userId; // ✅ correct field from token
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    throw new BadRequestError('Assignment not found');
  }

  if (assignment.completedStudents.includes(studentId)) {
    throw new BadRequestError('You have already submitted this assignment');
  }

  assignment.completedStudents.push(studentId);
  await assignment.save();

  res.status(StatusCodes.OK).json({
    message: 'Assignment submitted successfully',
    completedStudents: assignment.completedStudents,
  });
};


const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id }).populate('classes');

    if (!assignment) {
      throw new BadRequestError('Assignment not found');
    }

    if (assignment.classes.instructor.toString() !== req.user.userId) {
      throw new UnauthenticatedError('Not authorized to delete this assignment');
    }

    await assignment.remove();

    res.status(StatusCodes.OK).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error("Delete assignment error:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


module.exports = {
    createAssignment,
    getAssignment,
    updateAssignment,
    getAllAssignments,
    submitAssignment,
    deleteAssignment
};
