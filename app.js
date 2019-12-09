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

const tweets = [];


////////////Routes////////////////

//Get route to show all tweets
app.get("/tweets", (req, res) => {
    res.render("tweets/index", { tweets }); //{ tweets }: short hand when an obj's key is same as value
})

//Post route to create new tweets
app.post("/tweets", (req, res) => {
    const { username, post } = req.body;
    const tweet = {username, post }
    tweets.push(tweet);

    res.redirect("/tweets");
})

//Get route for 'create form'
app.get("/tweets/new", (req, res) => {
    res.render("tweets/form")
})


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})