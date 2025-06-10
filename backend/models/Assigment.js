const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide assignment name'],
    maxlength: 100,
    minlength: 3,
  },
  description: {
    type: String,
    required: [true, 'Please provide assignment description'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide assignment due date'],
  },
  completedStudents: {
    type: [String],
    trim: true,
    default: []
  },
  classes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: [true, 'Please provide class ID']
  },
});



module.exports = mongoose.model('Assignment', AssignmentSchema);
