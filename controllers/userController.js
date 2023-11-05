const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

// Register new user
exports.registerUser = CatchAsyncErrors(async (req, res, next) => {

    const {name, email, password, resume} = req.body;

    const user = await User.create({
        name,
        email,
        password,
        resume,
    });

    sendToken(user, 201, res);
});

// Login user
exports.loginUser = CatchAsyncErrors(async (req, res, next) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("please enter email & password", 400));
    }

    const user = await User.findOne({email}).select("+password");

    if (!user) {
        return next(new ErrorHandler("invalid email or password", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
        return next(new ErrorHandler("invalid email or password", 401));

    sendToken(user, 200, res)

});


//Log out
exports.logout = (req, res, next) => {

    res.cookie("token", null, {
        expire: new Date(Date.now()),
        httponly: true
    })

    res.status(200).json({
        success: true,
        message: "logged out"
    })
}



//get user details
exports.getUser = CatchAsyncErrors(async (req, res, next) => {

    // console.log(req.user._id)  // ObjectId("64387f3cfcbfd0d807ad569d")
    // console.log(req.user.id)  // 64387f3cfcbfd0d807ad569d
    const user = await User.findById(req.user.id);  // in auth middleware we store user after login as req.user

    res.status(200).json({
        success: true,
        user
    })
});

// get all user -- admin
exports.getAllUsers = CatchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
});


//get single user --admin
exports.getSingleUser = CatchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user)
        return next(new ErrorHandler("user not found", 400));

    res.status(200).json({
        success: true,
        user
    })
});


exports.getUserByRoomId = CatchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({roomID: req.params.id});
    if(!user)
        return next(new ErrorHandler("user not found", 400));
    res.status(200).json({
        success: true,
        user
    })
})

