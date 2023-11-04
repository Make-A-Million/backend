const Opening = require("../models/openingsModel");
const Company = require("../models/companyModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Opening => /api/v1/openings/new
exports.newOpening = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const company = await Company.findById(id);
    if(!company)
        return next(new ErrorHandler("Company not found", 404));

    const opening = await Opening.create({
        ...req.body,
        company: id
    });

    res.status(201).json({
        success: true,
        opening
    })
});

// Get all openings => /api/v1/openings
exports.getOpenings = CatchAsyncErrors(async (req, res, next) => {
    const openings = await Opening.find();

    res.status(200).json({
        success: true,
        openings
    })
});

// Get single opening => /api/v1/openings/:id
exports.getSingleOpening = CatchAsyncErrors(async (req, res, next) => {
    const opening = await Opening.findById(req.params.id);

    if(!opening)
        return next(new ErrorHandler("Opening not found", 404));

    res.status(200).json({
        success: true,
        opening
    })
});

//get all openings of a company
exports.getCompanyOpenings = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    const company = await Company.findById(id);

    if (!company)
        return next(new ErrorHandler("Company not found", 404));

    const openings = await Opening.find({company: id});

    res.status(200).json({
        success: true,
        openings
    });
})
