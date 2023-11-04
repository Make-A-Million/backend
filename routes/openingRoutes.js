const express = require("express");
const Router = express.Router();
const {newOpening, getOpenings, getSingleOpening, getCompanyOpenings} = require("../controllers/openingController");

Router.route("/:id/new").post(newOpening);
Router.route("/all").get(getOpenings);
Router.route("/:id").get(getSingleOpening);
Router.route("/company/:id").get(getCompanyOpenings);


module.exports = Router;
