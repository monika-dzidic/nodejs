const User = require("../models/user")
const Error = require("../models/error")
const { isFalsy } = require("../util/util")

// Retrieve all users from the database
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) next(Error.intervalServerError())
        else res.send(data)
    })
}

// Find all products that belong to a logged in user
exports.findUserProducts = (req, res, next) => {
    User.findProductsByUserId(req.user.id, (err, data) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.notFound())
        else res.send(data)
    })
}

// Add product to user
exports.addProduct = (req, res, next) => {
    if (isFalsy(req.params.productId)) {
        next(Error.badRequest('Missing product id'))
        return
    }

    User.addProductToUser(req.user.id, req.params.productId, (err, data) => {
        if (err && !err.errno == 1452) next(Error.intervalServerError())
        else if (err) next(Error.badRequest('Product does not exist'))
        else res.send(data)
    })
}

// Update a user identified by the userId in the request
exports.update = (req, res, next) => {
    const user = new User(req.body.email, req.body.name, req.body.active)
    if (!user.email.length) {
        next(Error.badRequest('Missing user email'))
        return
    }

    if (!user.name.length) {
        next(Error.badRequest('Missing user name'))
        return
    }

    User.updateById(req.user.id, user, (err, data) => {
        if (err && err.errno !== 1062) next(Error.intervalServerError())
        else if (err && err.errno == 1062) next(Error.badRequest('Email already taken'))
        else if (!data) next(Error.notFound('User does not exist'))
        else res.send(data)
    })
}