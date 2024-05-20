const Mysql = require("mysql2");
require("dotenv").config();

const mysql = Mysql.createConnection({
    host:"bfplrmksb9ksba8hfboj-mysql.services.clever-cloud.com",
    user: "uez9zedjqzk5b57d",
    password: "6MkGT4TGqXcT7wZeiktC",
    database:"bfplrmksb9ksba8hfboj"
});

mysql.connect((err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log(`Database connected`);
    }
});

module.exports = mysql;
