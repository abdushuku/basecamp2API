const express = require("express");
const app = express();
const Mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path")
require("dotenv").config()
const cookies = require("cookie-parser")
const bcrypt = require('bcrypt');
const expressSession = require("express-session");
const userAuth = require("./routers/userAuth.js")
const adminUser = require("./routers/adminRouter.js")
const project = require("./routers/newPorjectRouter.js")
const overView = require("./routers/projectOverView.js")
const comments = require("./routers/commitrouter.js")

const port = 3400;


app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookies())
app.use(
    expressSession({
      secret: "secret key",
      cookie: {},
      resave: false,
      saveUninitialized: false,
    })
);






app.use("/user", userAuth);
app.use("/admin", adminUser);
app.use("/project", project);
app.use("/setting", overView);
app.use("/user/project", comments)


app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})
