require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  database: process.env.DBNAME,
  password: process.env.DBPASSWORD,
});

pool.getConnection((err, conn) => {
  if (err) return console.log("Database is not found.");
  if (conn) return console.log("Database is connected");
});

module.exports = pool.promise();
