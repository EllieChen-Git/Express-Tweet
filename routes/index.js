const express = require("express");
const router = express.Router(); 
const PageController = require("./../controllers/page_controller");
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi, Segments } = require("celebrate");
const userRoutes = require("./user_routes");
const tweetRoutes = require("./tweet_routes");
const commentRoutes = require("./comment_routes");

// User Routes
router.use("/users", userRoutes);
// Tweet Routes
router.use("/tweets", tweetRoutes);
// Comment Routes
router.use("/comments", commentRoutes);

// Page Routes
router.get("/", PageController.index); //Landing page
router.get("/dashboard", PageController.dashboard); //Dashboard

// Authentication Routes
router.get("/register", AuthenticationController.registerNew);

router.post("/register", celebrate({
    [Segments.BODY]: {
        email: Joi.string().required(),
        password: Joi.string().required()
    }
}), AuthenticationController.registerCreate);

module.exports = router;