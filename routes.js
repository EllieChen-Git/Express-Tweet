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

//Get route to show a tweet
router.get("/tweets/:id", TweetController.show)

//Delete route to delete a tweet
router.delete("/tweets/:id", TweetController.destroy)

//Get route for 'edit form'
router.get("/tweets/:id/edit", TweetController.edit)

//PATCH route to update a tweet
router.patch("/tweets/:id", TweetController.update)

//PUT route to update a tweet
router.put("/tweets/:id", TweetController.update)

module.exports = router;