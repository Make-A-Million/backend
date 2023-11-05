const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const CatchAsyncErrors = require("../middleware/catchAsyncErrors");
const openai = require("../config/openai");


exports.askGPT = CatchAsyncErrors(async (req, res, next) => {
    const {prompt} = req.body;

    const response = await openai.edit.create({
        model: 'text-davinci-edit-001',
        input: 'What day of the wek is it?',
        instruction: 'Fix the spelling mistakes',
    });

    console.log(response.choices[0].text);

    res.status(200).json({
        success: true,
        response
    });
});

exports.generateQuestion = CatchAsyncErrors(async (req, res, next) => {


});

exports.validateUserAnswer = CatchAsyncErrors(async (req, res, next) => {
    console.log(req.body)
    const {id, prompt} = req.body;

    const user = await User.findById(id);

    if(!user)
        return next(new ErrorHandler("user not found", 404));

    console.log(prompt)

    prompt.map((p) => {
        delete p._id;
    })

    try {
        const data = {
            "messages": prompt,
            "max_tokens": 100,
            "temperature": 0,
            "model": "gpt-3.5-turbo"
        };
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();
        console.log(json)
        prompt.push({
            "role": "assistant",
            "content": json.choices[0].message.content
        })
        user.prompts = prompt;
        await user.save();
        res.status(200).json({
            success: true,
            next: json.choices[0].message.content
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e
        });
    }
});

