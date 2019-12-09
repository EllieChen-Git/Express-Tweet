const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars"); // [handlebars - optional]

const app = express();
const port = 3000;
const routes = require("./routes");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/tweet_app", { useNewUrlParser: true });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error)=> {console.log(error)});

// [handlebars - optional]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")


//Use ".use" when we wanna use middleware globally
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(routes);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})