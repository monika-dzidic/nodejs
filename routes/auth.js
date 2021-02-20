module.exports = (app, APIRoute) => {
    const auth = require("../controllers/auth")
    const root = `${APIRoute}/auth`

    // Login
    app.post(`${root}/login`, auth.login)
    
    // Register
    app.post(`${root}/register`, auth.register)
    
    // Token refresh
    app.post(`${root}/token`, auth.tokenRefresh)
}