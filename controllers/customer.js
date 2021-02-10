const Customer = require("../models/customer");
const Error = require("../models/error");
const { isFalsyObject, isFalsy } = require("../util/is-falsy-object");

// Create and save a new Customer
exports.create = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'));
        return;
    }

    const customer = new Customer({
        email: req.body.email,
        name: req.body.name,
        active: req.body.active
    });

    Customer.create(customer, (data, err) => {
        if (err) next(Error.badRequest(err.message))
        else res.send(data);
    });
};

// Retrieve all customers from the database
exports.findAll = (req, res) => {
    Customer.getAll((err, data) => {
        if (err) next(Error.badRequest(err.message))
        else res.send(data);
    });
};

// Find a single customer with a customerId
exports.findOne = (req, res, next) => {
    if (isFalsy(req.params.customerId)) {
        next(Error.badRequest('Missing customer id'));
        return;
    }

    Customer.findById(req.params.customerId, (data, err) => {
        if (err) next(Error.badRequest('DB err'))
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
};

// Update a customer identified by the customerId in the request
exports.update = (req, res, next) => {
    if (isFalsy(req.params.customerId)) {
        next(Error.badRequest('Missing customer id'));
        return;
    }

    if (isFalsyObject(req.body.customer)) {
        next(Error.badRequest('Missing customer in body'));
        return;
    }

    Customer.updateById(req.params.customerId, req.body.customer, (data, err) => {
        if (err) next(Error.badRequest('DB err'));
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
};

// Delete a customer with the specified customerId in the request
exports.delete = (req, res, next) => {
    if(isFalsy(req.params.customerId)){
        next(Error.badRequest('Missing customer id'));
        return;
    }

    Customer.remove(req.params.customerId, (data, err) => {
        if(err) next(Error.badRequest('DB err'));
        else if(!data) next(Error.notFound());
        else res.send(data)
    })
};