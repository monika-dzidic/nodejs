const Error = require("../models/error");

const errorHandler = (err, req, res, next) => {
    if (err instanceof Error) {
        res.status(err.status).json({ message: err.message })
        return;
    }

    res.status(500).json('Something went wrong');
}

module.exports = errorHandler;