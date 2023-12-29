const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const ErrorMiddleware = require("./middleware/error");
const Logger = require("node-requset-logger")

dotenv.config({ path: 'config/config.env' });
app.use(express.json());
app.use(cors());
app.use(Logger());



const companyRouter = require("./routes/companyRoutes");
const userRouter = require("./routes/userRoutes");
const openingRouter = require("./routes/openingRoutes");
const gptRouter = require("./routes/gptRoutes");


app.get("/", (req, res) => {
    res.send("sechire api");
});
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/opening", openingRouter);
app.use("/api/v1/gpt", gptRouter);


app.use(ErrorMiddleware);
module.exports = app;
