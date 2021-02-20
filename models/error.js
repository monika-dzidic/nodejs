class Error {
    constructor(status, message, body) {
        this.status = status
        if (message) this.message = message
        if (body) this.body
    }

    static badRequest = (message = 'Bad request') => new Error(400, message)

    static unauthorized = (message = 'Not authorized :)') => new Error(401, message)

    static forbidden = (message = 'Forbidden :)') => new Error(403, message)

    static notFound = (message = 'Not found') => new Error(404, message)

    static tooManyRequests = (message = 'Too many requests') => new Error(429, message)

    static intervalServerError = (message = 'Service not available') => new Error(500, message)
}

module.exports = Error