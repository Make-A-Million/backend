const express = require("express");
const Router = express.Router();

const {registerUser, loginUser, logout, getUserByRoomId} = require("../controllers/userController");

Router.route("/register").post(registerUser);
Router.route("/login").post(loginUser);
Router.route("/logout").post(logout);
Router.route("/room/:id").get(getUserByRoomId);

module.exports = Router;
