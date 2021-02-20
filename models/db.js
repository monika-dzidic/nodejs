const mysql = require("mysql")

const { databaseConfig } = require("../config/config.js")

const connection = mysql.createConnection({
    host: databaseConfig.HOST,
    user: databaseConfig.USER,
    password: databaseConfig.PASSWORD,
    database: databaseConfig.DB
})

connection.connect(error => {
    if (error) throw error
    console.log("Successfully connected to the database.")
})

module.exports = connection