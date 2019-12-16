const express = require("express");
const router = express.Router(); 

const userRoutes = require("./user_routes");
const tweetRoutes = require("./tweet_routes");
const commentRoutes = require("./comment_routes");

router.use("/users", userRoutes);
router.use("/tweets", tweetRoutes);
router.use("/comments", commentRoutes);

module.exports = router;