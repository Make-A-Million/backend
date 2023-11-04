const mongoose = require('mongoose');

const openingSchema = new mongoose.Schema({
    role: {
        type: String,
        required: [true, 'Please enter the role'],
    },
    description: {
        type: String,
        required: [true, 'Please enter the description'],
    },
    location: {
        type: String,
        required: [true, 'Please enter the location'],
    },
    salary: {
        type: String,
        required: [true, 'Please enter the salary'],
    },
    experience: {
        type: String,
        required: [true, 'Please enter the experience'],
    },
    skills: {
        type: [String],

    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
    },
    applicants: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Opening', openingSchema);


