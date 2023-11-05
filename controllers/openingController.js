const Opening = require("../models/openingsModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Opening => /api/v1/openings/new
exports.newOpening = CatchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    console.log(req.body)
    const company = await Company.findById(id);
    if (!company)
        return next(new ErrorHandler("Company not found", 404));

    const applicantsEmail = req.body.applicants;

    let applicants = [];
    for (let i = 0; i < applicantsEmail.length; i++) {
        const user = await User.findOne({email: applicantsEmail[i]});
        if (user) {
            applicants.push({
                user: user._id,
                email: user.email,
            });
        }
    }

    console.log(applicants)

    applicants.map(async (applicant) => {
        const user = await User.findById(applicant.id);
        user.roomID = generateRoomId();
        user.prompts = generatePrompt(company.name, req.body.role, req.body.description, user.resume);
        user.appliedJobs.push({
            company: id,
            status: "pending",
        });
        await user.save();
    });

    const opening = await Opening.create({
        role: req.body.role,
        description: req.body.description,
        company: id,
        applicants: applicants
    });

    res.status(201).json({
        success: true,
        opening
    });
});

function generateRoomId() {
    return `${randomString(4)}-${randomString(4)}`;
}

function randomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function generatePrompt(name, role, description, resume) {
    return [{
        "role": "system",
        "content": `You are the interviewer for a ${role} position at ${name}. 
                    Please consider the following job description and the candidate's resume:
                    Job Description:
                    ${description}
                    
                    Candidate's Resume:
                    ${resume}`
    },
    ]
}


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

    if (!opening)
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
