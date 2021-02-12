const User = require("../models/user");
const Error = require("../models/error");
const { isFalsyObject, isFalsy } = require("../util/util");

// Retrieve all users from the database
exports.findAll = (req, res) => {
    User.getAll((err, data) => {
        if (err) next(Error.intervalServerError())
        else res.send(data);
    });
};

// Find a single user with a userId
exports.findOne = (req, res, next) => {
    if (isFalsy(req.params.userId)) {
        next(Error.badRequest('Missing user id'));
        return;
    }

    User.findById(req.params.userId, (data, err) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
};

// Find all products added from user sent as userId
exports.findUserProducts = (req, res, next) => {
    if (isFalsy(req.params.userId)) {
        next(Error.badRequest('Missing user id'));
        return;
    }

    User.findProductsByUserId(req.params.userId, (data, err) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
}

// Create and save a new user
exports.create = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'));
        return;
    }

    const user = new User(req.body.email, req.body.name, req.body.active);
    if (!user.email.length) {
        next(Error.badRequest('Missing user email'));
        return;
    }

    if (!user.name.length) {
        next(Error.badRequest('Missing user name'));
        return;
    }

    User.create(user, (data, err) => {
        if (err) next(Error.intervalServerError())
        else res.send(data);
    });
};

// Add product to user
exports.addProduct = (req, res, next) => {
    if (isFalsy(req.params.userId)) {
        next(Error.badRequest('Missing user id'));
        return;
    }

    if (isFalsy(req.body.productId)) {
        next(Error.badRequest('Missing product id in body'));
        return;
    }

    User.addProductToUser(req.params.userId, req.body.productId, (data, err) => {
        if (err && !err.errno == 1452) next(Error.intervalServerError());
        else if (err) next(Error.badRequest());
        else res.send(data);
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res, next) => {
    if (isFalsy(req.params.userId)) {
        next(Error.badRequest('Missing user id'));
        return;
    }

    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing user in body'));
        return;
    }

    const user = new User(req.body.email, req.body.name, req.body.active)
    if (!user.email.length) {
        next(Error.badRequest('Missing user email'));
        return;
    }

    if (!user.name.length) {
        next(Error.badRequest('Missing user name'));
        return;
    }

    User.updateById(req.params.userId, user, (data, err) => {
        if (err) next(Error.intervalServerError());
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res, next) => {
    if (isFalsy(req.params.userId)) {
        next(Error.badRequest('Missing user id'));
        return;
    }

    User.remove(req.params.userId, (data, err) => {
        if (err) next(Error.intervalServerError());
        else if (!data) next(Error.notFound());
        else res.send(data)
    })
};