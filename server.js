const express = require("express")
const bodyParser = require("body-parser")

const { appConfig } = require("./config/config.js")

// Express setup
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const requestLimiter = require('./middleware/request-limiter')
app.use(requestLimiter)

require("./routes/auth")(app, appConfig.API_ROUTE)
require("./routes/user")(app, appConfig.API_ROUTE)
require("./routes/product")(app, appConfig.API_ROUTE)

const errorHandler = require('./middleware/error-handler')
app.use(errorHandler)

app.listen(appConfig.PORT, () => {
    console.log(`Server is running on port ${appConfig.PORT}.`)
})