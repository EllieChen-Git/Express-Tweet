const express = require("express");
const router = express.Router(); //router comes from Express, so we need to require express first

const tweets = [];

// router.get("/", (req, res) => {
//     res.render("tweet")
// })

//Get route to show all tweets
router.get("/tweets", (req, res) => {
    res.render("tweets/index", { tweets }); //{ tweets }: short hand when an obj's key is same as value
})

//Post route to create new tweets
router.post("/tweets", (req, res) => {
    const { username, post } = req.body;
    const tweet = {username, post }
    tweets.push(tweet);

    res.redirect("/tweets");
})

//Get route for 'create form'
router.get("/tweets/new", (req, res) => {
    res.render("tweets/form")
})

module.exports = router;