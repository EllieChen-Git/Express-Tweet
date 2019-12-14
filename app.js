//This is now our Express App

const express = require("express");
const exphbs = require("express-handlebars"); // [handlebars - optional]
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();


// [handlebars - optional]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Method Override
app.use(methodOverride("_method", { methods: ["POST", "GET"]}));

//Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Routes
app.use(require("./routes"));

//Remember to export app
module.exports = app;

