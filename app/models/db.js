const mysql = require("mysql");
require('dotenv').config();


let connection = mysql.createPool({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DB
});

module.exports = connection;