const express = require("express");
const bodyParser = require("body-parser");
const { appConfig } = require("./config/config.js");

// Express setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
const middleware = require('./middleware/index');
app.use(middleware.rateLimiter, middleware.errorHandler)

// Routes
require("./routes/customer")(app);

app.listen(appConfig.PORT, () => {
    console.log("Server is running on port 3000.");
});