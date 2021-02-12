const express = require("express");
const bodyParser = require("body-parser");
const { appConfig } = require("./config/config.js");

// Express setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const middleware = require('./middleware/index');
app.use(middleware.requestLimiter);

require("./routes/user")(app, appConfig.API_ROUTE);
require("./routes/product")(app, appConfig.API_ROUTE);

app.use(middleware.errorHandler);

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}.`);
});