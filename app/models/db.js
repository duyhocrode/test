const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

let connection = mysql.createPool({
    host: dbConfig.host.HOST,
    user: dbConfig.host.USER,
    password: dbConfig.host.PASSWORD,
    database: dbConfig.host.DB
});
//to verify healthy before start
connection

module.exports = connection;