module.exports = (app, APIRoute) => {
    const product = require("../controllers/product")
    const root = `${APIRoute}/product`

    // Retrieve all products
    app.get(`${root}`, product.findAll)

    // Retrieve a single product
    app.get(`${root}/:productName`, product.findOne)

    // Create a new product
    app.post(`${root}`, product.create)
}