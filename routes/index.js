const express = require("express");
const router = express.Router(); 

const tweetRoutes = require("./tweet_routes");
const userRoutes = require("./user_routes");

router.use("/tweets", tweetRoutes);
router.use("/users", userRoutes);

module.exports = router;