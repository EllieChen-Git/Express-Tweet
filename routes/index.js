const express = require("express");
const router = express.Router();
const PageController = require("./../controllers/page_controller");
const AuthenticationController = require("./../controllers/authentication_controller");
const { celebrate, Joi, Segments } = require("celebrate");
const {
  authRedirect,
  authorise
} = require("./../middleware/authorisation_middleware");
//destructuring func from the middleware file
const passport = require("passport");

// Dynamic Routing
const userRoutes = require("./user_routes");
const tweetRoutes = require("./tweet_routes");
const commentRoutes = require("./comment_routes");

// User Routes
router.use("/users", userRoutes);
// Tweet Routes
router.use("/tweets", tweetRoutes);
// Comment Routes
router.use("/comments", commentRoutes);

// Authentication Routes

// User Registration
router.get("/register", authRedirect, AuthenticationController.registerNew);
router.post(
  "/register",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  AuthenticationController.registerCreate
);

// User Login
router.get("/login", authRedirect, AuthenticationController.loginNew);
router.post(
  "/login",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  passport.authenticate("local", {
    // successRedirect: "/dashboard",
    failureRedirect: "/login",
    session: false //when user logs in, don't use that session
  }),
  AuthenticationController.loginCreate
);

// User Logout
router.get("/logout", AuthenticationController.logout);

// Page Routes
// Landing page
router.get("/", PageController.index);
// Dashboard
router.get(
  "/dashboard",
  passport.authenticate("jwt", { session: false }),
  PageController.dashboard
);

module.exports = router;
