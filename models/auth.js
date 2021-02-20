const jwt = require("jsonwebtoken")

const sql = require("./db.js")
const hash = require("../util/hash")
const { authConfig } = require("../config/config")

class Auth {
    constructor() { }

    static signIn = (user, result) => {
        sql.query(`SELECT * FROM user WHERE email = '${user.email}'`, (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            if (res.length) {
                if (!hash.compare(user.password, { hashedPassword: res[0].passwordHash, salt: res[0].passwordSalt })) result(null, null)

                const accessToken = jwt.sign({ id: res[0].id }, authConfig.ACCESS_TOKEN_SECRET, { expiresIn: `${authConfig.ACCESS_TOKEN_EXPIRATION_TIME}m` })
                const refreshToken = jwt.sign({ id: res[0].id }, authConfig.REFRESH_TOKEN_SECRET, { expiresIn: `${authConfig.REFRESH_TOKEN_EXPIRATION_TIME}m` })
                result(null, { accessToken, refreshToken })
                return
            }

            result(null, null)
        })
    }

    static signUp = (newUser, result) => {
        const passwordSalt = hash.generateSalt(newUser.email.length)
        const passwordHash = hash.generateHash(newUser.password, passwordSalt).hashedPassword
        delete newUser.password

        sql.query("INSERT INTO user SET ?", { ...newUser, passwordHash, passwordSalt }, (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            result(null, newUser)
        })
    }

    static refreshToken = (accessToken, refreshToken, result) => {
        if (!refreshToken) {
            result({ status: 403 }, null)
            return
        }

        let payload
        try {
            payload = jwt.verify(accessToken, authConfig.ACCESS_TOKEN_SECRET)
        }
        catch (e) {
            result({ status: 401 }, null)
            return
        }

        try {
            jwt.verify(refreshToken, authConfig.REFRESH_TOKEN_SECRET)
        }
        catch (e) {
            result({ status: 401 }, null)
            return
        }

        const newToken = jwt.sign({ id: payload.id }, authConfig.ACCESS_TOKEN_SECRET, { expiresIn: `${authConfig.ACCESS_TOKEN_EXPIRATION_TIME}m` });
        result(null, { newToken })
    }
}

module.exports = Auth