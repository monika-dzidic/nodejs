const Auth = require("../models/auth")
const User = require("../models/user")
const Error = require("../models/error")
const { isFalsy, isFalsyObject } = require("../util/util")

// User login with token retrieve
exports.login = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'))
        return
    }

    const user = {
        email: req.body.email,
        password: req.body.password
    }

    if (!user.email || !user.email.trim().length) {
        next(Error.badRequest('Missing email'))
        return
    }

    if (!user.password || !user.password.trim().length) {
        next(Error.badRequest('Missing password'))
        return
    }

    Auth.signIn(user, (err, data) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.badRequest(`There is no user registered with ${user.email}`))
        else {
            user.accessToken = data.accessToken
            user.refreshToken = data.refreshToken
            res.send(user)
        }
    })
}

// Register new user
exports.register = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'))
        return
    }

    const user = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    }

    if (isFalsy(user.email) || !user.email.trim().length) {
        next(Error.badRequest('Missing email'))
        return
    }

    if (isFalsy(user.name) || !user.name.trim().length) {
        next(Error.badRequest('Missing name'))
        return
    }

    if (isFalsy(user.password) || !user.password.trim().length) {
        next(Error.badRequest('Missing password'))
        return
    }

    User.findByEmail(user.email, (err, foundUser) => {
        if (err) next(Error.intervalServerError())
        else if (!foundUser) {
            Auth.signUp(user, (err, newUser) => {
                if (err) next(Error.intervalServerError())
                else res.send(newUser)
            })
        } else {
            next(Error.badRequest('Email is in use'))
        }
    })
}

// Refresh user token
exports.tokenRefresh = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'))
        return
    }

    const refreshToken = req.body.token
    if (isFalsy(refreshToken) || !refreshToken.trim().length) {
        next(Error.badRequest('Missing token in body'))
        return
    }

    Auth.refreshToken(req.headers.authorization.split(' ')[1], refreshToken, (err, newToken) => {
        if (err && err.status == 401) next(Error.unauthorized())
        else if (err && err.status == 403) next(Error.forbidden())
        else res.send(newToken)
    })
}