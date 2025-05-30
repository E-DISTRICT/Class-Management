const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        maxlength: 50,
        minlength: 3,
    },
    grade: {
        type: String,
        required: [true, 'Please provide grade'],
        maxlength: 50,
        minlength: 1,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;

/*
Example JSON object to create a class using Postman:

{
    "name": "Math 101",
    "grade": "A",
    "instructor": "60d5ec49f8d2e814c8a4f9b1"
}

Replace the "instructor" value with a valid Instructor ObjectId from your database.
*/