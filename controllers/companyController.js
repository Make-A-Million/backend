const Company = require("../models/companyModel");
const Opening = require("../models/openingsModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

// Register new Company
exports.registerCompany = CatchAsyncErrors(async (req, res, next) => {

    const {name, email, password} = req.body;

    // const myCloud = await cloudinary.uploader.upload(avatar, {
    //     folder: "avatars",
    //     width: 150,
    //     crop: "scale"
    // });

    const company = await Company.create({
        name,
        email,
        password,
        // avatar: {
        //     public_id: myCloud.public_id,
        //     url: myCloud.secure_url
        // }
    });

    // const token = Company.getJWTToken();   // this method is defined in the useModel

    // res.status(201).json({
    //   success: true,
    //   token
    // });

    sendToken(company, 201, res);
});

// Login Company
exports.loginCompany = CatchAsyncErrors(async (req, res, next) => {

    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("please enter email & password", 400));
    }

    const company = await Company.findOne({email}).select("+password");

    if (!company) {
        return next(new ErrorHandler("invalid email or password", 401));
    }

    const isPasswordMatched = await company.comparePassword(password);

    if (!isPasswordMatched)
        return next(new ErrorHandler("invalid email or password", 401));

    sendToken(company, 200, res)

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

//get Company details
exports.getCompany = CatchAsyncErrors(async (req, res, next) => {

    // console.log(req.Company._id)  // ObjectId("64387f3cfcbfd0d807ad569d")
    // console.log(req.Company.id)  // 64387f3cfcbfd0d807ad569d
    const company = await Company.findById(req.company.id);  // in auth middleware we store Company after login as req.Company

    res.status(200).json({
        success: true,
        company
    })
});

// get all Company -- admin
exports.getAllCompanys = CatchAsyncErrors(async (req, res, next) => {
    const company = await Company.find();
    res.status(200).json({
        success: true,
        company
    })
});

//get single Company --admin
exports.getSingleCompany = CatchAsyncErrors(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company)
        return next(new ErrorHandler("company not found", 400));

    res.status(200).json({
        success: true,
        company
    })
});

