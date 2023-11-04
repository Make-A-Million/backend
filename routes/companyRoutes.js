const express = require("express");
const Router = express.Router();

const {registerCompany, loginCompany} = require("../controllers/companyController");

Router.route("/register").post(registerCompany);
Router.route("/login").post(loginCompany);

module.exports = Router;
