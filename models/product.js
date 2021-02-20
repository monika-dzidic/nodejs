const sql = require("./db.js")
const { isFalsy } = require("../util/util.js")

class Product {
    constructor(name, active) {
        this.name = name ? name.trim() : ''
        this.active = isFalsy(active) ? true : active
    }

    static getAll = result => {
        sql.query("SELECT * FROM product", (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            result(null, res)
        })
    }

    static findByName = (productName, result) => {
        sql.query(`SELECT * FROM product WHERE name = ${productName}`, (err, res) => {
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

    static create = (newProduct, result) => {
        sql.query("INSERT INTO product SET ?", newProduct, (err, res) => {
            if (err) {
                result(err, null)
                return
            }

            result(null, { ...newProduct })
        })
    }
}

module.exports = Product