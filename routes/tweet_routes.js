const express = require("express");
const router = express.Router();
const TweetController = require("./../controllers/tweet_controller");

//Get route to show all tweets
router.get("/", TweetController.index)

//Post route to create new tweets
router.post("/", TweetController.create)

//Get route for 'create form'
router.get("/new", TweetController.newResource)

//Get route to show a tweet
router.get("/:id", TweetController.show)

//Delete route to delete a tweet
router.delete("/:id", TweetController.destroy)

//Get route for 'edit form'
router.get("/:id/edit", TweetController.edit)

//PATCH route to update a tweet
router.patch("/:id", TweetController.update)

//PUT route to update a tweet
router.put("/:id", TweetController.update)

module.exports = router;