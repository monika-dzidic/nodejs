const { isFalsy } = require("../util/util.js");
const sql = require("./db.js");

class Product {
    constructor(name, active) {
        this.name = name ? name.trim() : '';
        this.active = isFalsy(active) ? 0 : 1;
    }

    static getAll = result => {
        sql.query("SELECT * FROM product", (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            result(null, res);
        });
    }

    static findById = (productId, result) => {
        sql.query(`SELECT * FROM product WHERE id = ${productId}`, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.length) {
                result(res[0], null);
                return;
            }

            result(null, null);
        });
    }

    static create = (newProduct, result) => {
        sql.query("INSERT INTO product SET ?", newProduct, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            result({ id: res.insertId, ...newProduct }, null);
        });
    }
}

module.exports = Product;