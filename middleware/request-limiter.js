const moment = require('moment');
const redis = require('redis');
const redisClient = redis.createClient();
const { redisConfig } = require('../config/config');

const Error = require('../models/error');

module.exports = (req, res, next) => {
    try {
        // check that redis client exists
        if (!redisClient) {
            throw new Error('Redis client does not exist!');
            process.exit(1);
        }
        // fetch records of current user using IP address, returns null when no record is found
        redisClient.get(req.ip, function (err, record) {
            if (err) throw err;
            const currentRequestTime = moment();
            //  if no record is found , create a new record for user and store to redis
            if (record == null) {
                let newRecord = [];
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                };
                newRecord.push(requestLog);
                redisClient.set(req.ip, JSON.stringify(newRecord));
                next();
            }
            // if record is found, parse it's value and calculate number of requests users has made within the last window
            let data = JSON.parse(record);
            let windowStartTimestamp = moment().subtract(redisConfig.WINDOW_SIZE_IN_HOURS, 'hours').unix();
            let requestsWithinWindow = data.filter(entry => entry.requestTimeStamp > windowStartTimestamp);
            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => accumulator + entry.requestCount, 0);
            // if number of requests made is greater than or equal to the desired maximum, return error
            if (totalWindowRequestsCount >= redisConfig.MAX_WINDOW_REQUEST_COUNT) {
                next(Error.tooManyRequests(`You have exceeded the ${redisConfig.MAX_WINDOW_REQUEST_COUNT} requests in ${redisConfig.WINDOW_SIZE_IN_HOURS} hrs limit!`))
            } else {
                // if number of requests made is less than allowed maximum, log new entry
                let lastRequestLog = data[data.length - 1];
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(redisConfig.WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix();
                //  if interval has not passed since last request log, increment counter
                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++;
                    data[data.length - 1] = lastRequestLog;
                } else {
                    //  if interval has passed, log new entry for current user and timestamp
                    data.push({
                        requestTimeStamp: currentRequestTime.unix(),
                        requestCount: 1
                    });
                }
                redisClient.set(req.ip, JSON.stringify(data));
                next();
            }
        });
    } catch (error) {
        next(error);
    }
};