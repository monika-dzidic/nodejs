const dotenv = require('dotenv');
dotenv.config().parsed;

exports.appConfig = {
    ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000
}

exports.databaseConfig = {
    HOST: process.env.HOST,
    USER: process.env.USER,
    PASSWORD: process.env.PASSWORD,
    DB: process.env.DB
};

exports.redisConfig = {
    WINDOW_SIZE_IN_HOURS: process.env.WINDOW_SIZE_IN_HOURS || 24,
    MAX_WINDOW_REQUEST_COUNT: process.env.MAX_WINDOW_REQUEST_COUNT || 100,
    WINDOW_LOG_INTERVAL_IN_HOURS: process.env.WINDOW_LOG_INTERVAL_IN_HOURS || 1
}