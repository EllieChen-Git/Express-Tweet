const express = require("express");
const router = express.Router(); //router comes from Express, so we need to require express first



const tweetRoutes = require("./tweet_routes");

router.use("/tweets", tweetRoutes);


module.exports = router;