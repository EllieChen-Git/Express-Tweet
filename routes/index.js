const express = require("express");
const router = express.Router(); 
const PageController = require("./../controllers/page_controller");
const userRoutes = require("./user_routes");
const tweetRoutes = require("./tweet_routes");
const commentRoutes = require("./comment_routes");

// User Routes
router.use("/users", userRoutes);
// Tweet Routes
router.use("/tweets", tweetRoutes);
// Comment Routes
router.use("/comments", commentRoutes);

// Landing page
router.get("/", PageController.index);

module.exports = router;