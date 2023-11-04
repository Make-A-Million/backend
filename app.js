const express = require("express");
const app = express();
const dotenv = require("dotenv");
const ErrorMiddleware = require("./middleware/error");

dotenv.config({ path: 'config/config.env' });
app.use(express.json());


const RESET = '\x1b[0m';
const LIGHT_GREEN = '\x1b[92m';
const YELLOW = '\x1b[33m';
const LIGHT_BLUE = '\x1b[94m';
const RED = '\x1b[31m';
const GRAYISH = '\x1b[37m';
app.use((req, res, next) => {
    const arrow = `${GRAYISH}==> `;
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const method = req.method;
    const url = req.url;

    let methodColor;
    switch (method) {
        case 'GET':
            methodColor = LIGHT_GREEN;
            break;
        case 'POST':
            methodColor = YELLOW;
            break;
        case 'DELETE':
            methodColor = RED;
            break;
        case 'PUT':
            methodColor = LIGHT_BLUE;
            break;
        default:
            methodColor = RESET;
    }

    console.log(`\n${arrow}[${timestamp}] Incoming request: ${methodColor}${method}${RESET} ${GRAYISH}${url}${RESET} from ${ip}`);
    // console.log(`${GRAYISH}Headers:${RESET}`, req.headers);
    // console.log(`${GRAYISH}Body:${RESET}`, req.body);

    res.on('finish', () => {
        const statusCode = res.statusCode;
        let statusColor;
        if (statusCode >= 300) {
            statusColor = RED;
        } else {
            statusColor = LIGHT_GREEN;
        }
        console.log(`${GRAYISH}[${timestamp}] Response status: ${statusColor}${statusCode}${RESET}`);
    });

    next();
});


const companyRouter = require("./routes/companyRoutes");

app.use("/api/v1/company", companyRouter);


app.use(ErrorMiddleware);
module.exports = app;
