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
