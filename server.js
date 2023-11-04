const app = require("./app");
const connectDB = require("./config/database");


// Handle uncaught exceptions  eg: using variable which are not defined
process.on("uncaughtException", err => {
    console.log("Error: " + err.message);
    console.log("Shutting down the server due to uncaughtException");
    process.exit(1);
})


connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log("Server started on port " + process.env.PORT)
})

// unhandled promise rejection  eg: changing the uri for connecting to db (in dotenv file)
process.on("unhandledRejection", err => {
    console.log("Error: " + err.message);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    })
});





