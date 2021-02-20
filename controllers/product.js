const Product = require("../models/product")
const Error = require("../models/error")
const { isFalsy, isFalsyObject } = require("../util/util")

// Retrieve all products
exports.findAll = (req, res) => {
    Product.getAll((err, data) => {
        if (err) next(Error.intervalServerError())
        else res.send(data)
    })
}

// Find a single product by name
exports.findOne = (req, res, next) => {
    if (isFalsy(req.params.productName)) {
        next(Error.badRequest('Missing product name'))
        return
    }

    Product.findByName(req.params.productName, (err, data) => {
        if (err) next(Error.intervalServerError())
        else if (!data) next(Error.notFound())
        else res.send(data)
    })
}

exports.create = (req, res, next) => {
    if (isFalsyObject(req.body)) {
        next(Error.badRequest('Missing request body'))
        return
    }

    const product = new Product(req.body.name, req.body.active)
    if (!product.name.length) {
        next(Error.badRequest('Missing product name'))
        return
    }

    Product.create(product, (err, data) => {
        if (err && err.errno != 1062) next(Error.intervalServerError())
        else if (err) next(Error.badRequest('Product already exists'))
        else res.send(data)
    })
}