const CatchAsyncErrors = require("../middleware/catchAsyncErrors")
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Company = require("../models/companyModel");

exports.isAuthenticatedUser = (role) => CatchAsyncErrors(async (req, res, next) => {

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return next(new ErrorHandler("A token is required for authentication", 403))
    }

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRETE);
        if (role === "user") {
            const user = await User.findById(decodedData.id);
            req.user = user
        }
        if (role === "company") {
            const company = await Company.findById(decodedData.id);
            req.company = company
        }

    } catch (err) {
        return next(new ErrorHandler("Invalid token", 401))
    }
    return next();
});
