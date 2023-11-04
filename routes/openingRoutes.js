const express = require("express");
const Router = express.Router();
const {newOpening} = require("../controllers/openingController");

Router.route("/:id/new").post(newOpening);

module.exports = Router;
