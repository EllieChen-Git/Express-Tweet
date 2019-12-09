const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars"); // [handlebars - optional]

const app = express();
const port = 3000;

// [handlebars - optional]
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars")


//Use ".use" when we wanna use middleware globally
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.use(require("./routes"));

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})