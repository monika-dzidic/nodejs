const { isFalsy } = require("../util/util.js");
const sql = require("./db.js");

class User {
    constructor(email, name, active) {
        this.email = email ? email.trim() : '';
        this.name = name ? name.trim() : '';
        this.active = isFalsy(active) ? 0 : active;
    }

    static getAll = result => {
        sql.query("SELECT * FROM user", (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            result(null, res);
        });
    }

    static findById = (userId, result) => {
        sql.query(`SELECT * FROM user WHERE id = ${userId}`, (err, res) => {
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

    static findProductsByUserId = (userId, result) => {
        sql.query(`SELECT product_id,
            (SELECT name FROM product WHERE id=product_id) AS name, 
            count(product_id) AS count 
            FROM user_product WHERE user_id=${userId} GROUP BY product_id;
        `, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.length) {
                result(res, null);
                return;
            }

            result(null, null);
        });
    }

    static create = (newUser, result) => {
        sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            result({ id: res.insertId, ...newUser }, null);
        });
    }

    static addProductToUser = (userId, productId, result) => {
        sql.query(`INSERT INTO user_product (user_id, product_id) VALUES (${userId}, ${productId})`, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            result({ id: res.insertId }, null);
        });
    }

    static updateById = (id, user, result) => {
        sql.query("UPDATE user SET email = ?, name = ?, active = ? WHERE id = ?", [user.email, user.name, user.active, id], (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result(null, null);
                return;
            }

            result({ id: id, ...user }, null);
        });
    }

    static remove = (id, result) => {
        sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result(null, null);
                return;
            }

            result({ id: id }, null);
        });
    }
}

module.exports = User;