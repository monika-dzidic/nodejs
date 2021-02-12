const Error = require("../models/error");
const Product = require("../models/product");
const { isFalsy, isFalsyObject } = require("../util/util");

// Retrieve all products
exports.findAll = (req, res) => {
    Product.getAll((err, data) => {
        if (err) next(Error.intervalServerError())
        else res.send(data);
    });
};

// Find a single product with a productId
exports.findOne = (req, res, next) => {
    if (isFalsy(req.params.productId)) {
        next(Error.badRequest('Missing product id'));
        return;
    }

    Product.findById(req.params.productId, (data, err) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.notFound());
        else res.send(data);
    });
};

exports.create = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'));
        return;
    }

    const product = new Product(req.body.name, req.body.active);
    if (!product.name.length) {
        next(Error.badRequest('Missing product name'));
        return;
    }

    Product.create(product, (data, err) => {
        if (err) next(Error.intervalServerError())
        else res.send(data);
    });
}