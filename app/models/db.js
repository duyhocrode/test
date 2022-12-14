const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

let connection = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});
//to verify healthy before start
connection

module.exports = connection;