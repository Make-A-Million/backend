const express = require("express");
const app = express();
const dotenv = require("dotenv");
const ErrorMiddleware = require("./middleware/error");

dotenv.config({ path: 'config/config.env' });
app.use(express.json());



app.use(ErrorMiddleware);
module.exports = app;
