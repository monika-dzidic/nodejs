const sql = require("./db.js")
const { isFalsy } = require("../util/util.js")

class User {
    constructor(email, name, active) {
        this.email = email ? email.trim() : ''
        this.name = name ? name.trim() : ''
        this.active = isFalsy(active) ? true : active
    }

    static getAll = result => {
        sql.query("SELECT * FROM user", (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            result(null, res.map(user => ({ email: user.email, name: user.name, active: user.active })))
        })
    }

    static findByEmail = (email, result) => {
        sql.query(`SELECT * FROM user WHERE email = '${email}'`, (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            if (res.length) {
                result(null, res[0])
                return
            }

            result(null, null)
        })
    }

    static findProductsByUserId = (userId, result) => {
        sql.query(`SELECT
            (SELECT name FROM product WHERE id=product_id) AS name,
            count(product_id) AS count 
            FROM user_product WHERE user_id=${userId} GROUP BY product_id
        `, (err, res) => {
            if (err) {
                result(err, null)
                return
            }


            if (res.length) {
                result(null, res)
                return
            }

            result(null, [])
        })
    }

    static addProductToUser = (userId, productId, result) => {
        sql.query(`INSERT INTO user_product (user_id, product_id) VALUES (${userId}, ${productId})`, (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            this.findProductsByUserId(userId, result)
        })
    }

    static updateById = (id, user, result) => {
        sql.query("UPDATE user SET email = ?, name = ?, active = ? WHERE id = ?", [user.email, user.name, user.active, id], (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            if (res.affectedRows == 0) {
                result(null, null)
                return
            }

            result(null, { ...user })
        })
    }
}

module.exports = User