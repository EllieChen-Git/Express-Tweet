//This is now our Express App

const express = require("express");
const exphbs = require("express-handlebars"); // [handlebars - optional]
const morgan = require("morgan");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const app = express();


// [Handlebars]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Express Session
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60000
    }
}))

// Method Override
app.use(methodOverride("_method", { methods: ["POST", "GET"]}));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Morgan
app.use(morgan("combined"));

//Routes
app.use(require("./routes"));

//Error Handler Middleware
app.use(require("./middleware/error_handler_middleware"));

//Remember to export app
module.exports = app;

