const express = require("express");
const router = express.Router(); //router comes from Express, so we need to require express first
const TweetController = require("./controllers/tweet_controller");

router.get("/", (req, res) => {
    res.send("Landing Page")
})

//Get route to show all tweets
router.get("/tweets", TweetController.index)

//Post route to create new tweets
router.post("/tweets", TweetController.create)

//Get route for 'create form'
router.get("/tweets/new", TweetController.newResource)

module.exports = router;