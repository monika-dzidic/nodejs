module.exports = (app, APIRoute) => {
    const user = require("../controllers/user")
    const root = `${APIRoute}/user`

    const authenticateJWT = require("../middleware/jwt-token")

    // Retrieve all users
    app.get(`${root}`, authenticateJWT, user.findAll)

    // Retrieve user products
    app.get(`${root}/products`, authenticateJWT, user.findUserProducts)

    // Add product to user
    app.post(`${root}/product/:productId`, authenticateJWT, user.addProduct)

    // Update a user
    app.put(`${root}`, authenticateJWT, user.update)
}