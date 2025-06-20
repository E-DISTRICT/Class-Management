const Student = require('../models/Student');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('../errors');

const getStudentsInClass = async (req, res) => {
    const { classId } = req.params;
    if (!classId) throw new BadRequestError("Missing class ID");

    const students = await Student.find({ classes: classId }).select('name lastName email');
    res.status(StatusCodes.OK).json({ students });
};

module.exports = { getStudentsInClass };
