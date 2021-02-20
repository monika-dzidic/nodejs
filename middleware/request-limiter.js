const moment = require('moment')
const redis = require('redis')
const redisClient = redis.createClient()

const { redisConfig } = require('../config/config')

const Error = require('../models/error')

const requestLimiter = (req, res, next) => {
    try {
        if (!redisClient) {
            throw new Error('Redis client does not exist!')
            process.exit(1)
        }
        redisClient.get(req.ip, function (err, record) {
            if (err) throw err
            const currentRequestTime = moment()
            if (record == null) {
                let newRecord = []
                let requestLog = {
                    requestTimeStamp: currentRequestTime.unix(),
                    requestCount: 1
                }
                newRecord.push(requestLog)
                redisClient.set(req.ip, JSON.stringify(newRecord))
                next()
            }
            let data = JSON.parse(record)
            let windowStartTimestamp = moment().subtract(redisConfig.WINDOW_SIZE_IN_HOURS, 'hours').unix()
            let requestsWithinWindow = data.filter(entry => entry.requestTimeStamp > windowStartTimestamp)
            let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator, entry) => accumulator + entry.requestCount, 0)
            if (totalWindowRequestsCount >= redisConfig.MAX_WINDOW_REQUEST_COUNT) {
                next(Error.tooManyRequests(`You have exceeded the ${redisConfig.MAX_WINDOW_REQUEST_COUNT} requests in ${redisConfig.WINDOW_SIZE_IN_HOURS} hrs limit!`))
            } else {
                let lastRequestLog = data[data.length - 1]
                let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime.subtract(redisConfig.WINDOW_LOG_INTERVAL_IN_HOURS, 'hours').unix()
                if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
                    lastRequestLog.requestCount++
                    data[data.length - 1] = lastRequestLog
                } else {
                    data.push({
                        requestTimeStamp: currentRequestTime.unix(),
                        requestCount: 1
                    })
                }
                redisClient.set(req.ip, JSON.stringify(data))
                next()
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = requestLimiter