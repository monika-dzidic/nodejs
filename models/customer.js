const sql = require("./db.js");

class Customer {
    constructor(customer) {
        this.email = customer.email;
        this.name = customer.name;
        this.active = customer.active;
    }
}

Customer.create = (newCustomer, result) => {
    sql.query("INSERT INTO customers SET ?", newCustomer, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }

        result({ id: res.insertId, ...newCustomer }, null);
    });
};

Customer.findById = (customerId, result) => {
    sql.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, res) => {
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
};

Customer.getAll = result => {
    sql.query("SELECT * FROM customers", (err, res) => {
        if (err) {
            result(null, err);
            return;
        }

        result(null, res);
    });
};

Customer.updateById = (id, customer, result) => {
    sql.query(
        "UPDATE customers SET email = ?, name = ?, active = ? WHERE id = ?",
        [customer.email, customer.name, customer.active, id],
        (err, res) => {
            if (err) {
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                result(null, null);
                return;
            }

            result({ id: id, ...customer }, null);
        }
    );
};

Customer.remove = (id, result) => {
    sql.query("DELETE FROM customers WHERE id = ?", id, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            result(null, null);
            return;
        }

        result(res, null);
    });
};

module.exports = Customer;