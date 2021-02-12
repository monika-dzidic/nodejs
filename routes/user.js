module.exports = (app, APIRoute) => {
    const user = require("../controllers/user");
    const root = `${APIRoute}/user`

    // Retrieve all users
    app.get(`${root}`, user.findAll);

    // Retrieve a single user
    app.get(`${root}/:userId`, user.findOne);

    // Retrieve user products
    app.get(`${root}/:userId/product`, user.findUserProducts);

    // Create a new user
    app.post(`${root}`, user.create);

    // Add product to user
    app.post(`${root}/:userId/product`, user.addProduct);

    // Update a user
    app.put(`${root}/:userId`, user.update);

    // Delete a user
    app.delete(`${root}/:userId`, user.delete);
};