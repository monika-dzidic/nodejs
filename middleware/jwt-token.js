const jwt = require("jsonwebtoken")

const Error = require("../models/error")
const { authConfig } = require("../config/config")

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) next(Error.unauthorized())
    else {
        let payload
        const token = authHeader.split(' ')[1];
        try {
            payload = jwt.verify(token, authConfig.ACCESS_TOKEN_SECRET)
        }
        catch (e) {
            next(Error.forbidden())
            return
        }

        req.user = payload
        next()
    }
}

module.exports = authenticateJWT