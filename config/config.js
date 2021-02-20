const dotenv = require('dotenv')
dotenv.config().parsed

exports.appConfig = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    API_ROUTE: process.env.API || '/api'
}

exports.authConfig = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || '',
    ACCESS_TOKEN_EXPIRATION_TIME: process.env.ACCESS_TOKEN_EXPIRATION_TIME_IN_MINS || 120,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
    REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME_IN_MINS || 8600,
}

exports.databaseConfig = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB
}

exports.redisConfig = {
    WINDOW_SIZE_IN_HOURS: process.env.WINDOW_SIZE_IN_HOURS || 24,
    MAX_WINDOW_REQUEST_COUNT: process.env.MAX_WINDOW_REQUEST_COUNT || 100,
    WINDOW_LOG_INTERVAL_IN_HOURS: process.env.WINDOW_LOG_INTERVAL_IN_HOURS || 1
}