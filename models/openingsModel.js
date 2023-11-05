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
    company: {
        type: mongoose.Schema.ObjectId,
        ref: "Company",
    },
    applicants: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('Opening', openingSchema);


