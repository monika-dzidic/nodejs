class Error {
    constructor(status, message, body) {
        this.status = status;
        if (message) this.message = message;
        if (body) this.body;
    }
};

Error.badRequest = (message = 'Bad request') => new Error(400, message)

Error.notFound = (message = 'Not found') => new Error(404, message);

Error.tooManyRequests = (message = 'Too many requests') => new Error(429, message);

Error.intervalServerError = (message = 'Service not available') => new Error(500, message)

module.exports = Error;