const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters'],
        minLength: [4, 'Your name cannot be less than 4 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [8, 'Your password must be longer than 8 characters'],
        select: false, // This will not show the password in the response when we get the user by find methods
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


companySchema.pre("save", async function(next) {
    if(!this.isModified("password"))
        next();
    this.password = await bcrypt.hash(this.password, 10);  // to store the hashed password
})

// JWT TOKEN
companySchema.methods.getJWTToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRETE, {  // we are making id as _id to verify data in future
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// compare password
companySchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

//reset password
companySchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


module.exports = mongoose.model('Company', companySchema);



