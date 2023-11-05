const express = require("express");
const Router = express.Router();
const {askGPT, validateUserAnswer} = require("../controllers/gptController");

Router.route("/ask").get(askGPT);
Router.route("/check").post(validateUserAnswer);


module.exports = Router;
