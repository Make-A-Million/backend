const express = require("express");
const Router = express.Router();

const {registerCompany, loginCompany, addOpenings} = require("../controllers/companyController");

Router.route("/register").post(registerCompany);
Router.route("/login").post(loginCompany);
Router.route("/:id/add").post(addOpenings);

module.exports = Router;
