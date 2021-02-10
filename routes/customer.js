module.exports = app => {
    const customers = require("../controllers/customer");
    
    // Retrieve all customers
    app.get("/customers", customers.findAll);

    // Retrieve a single customer with customerId
    app.get("/customers/:customerId", customers.findOne);

    // Create a new customer
    app.post("/customers", customers.create);

    // Update a customer with customerId
    app.put("/customers/:customerId", customers.update);

    // Delete a customer with customerId
    app.delete("/customers/:customerId", customers.delete);
};