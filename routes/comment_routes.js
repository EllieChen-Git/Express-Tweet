const express = require("express");
const router = express.Router();
const CommentController = require("./../controllers/comment_controller");

router.post("/:tweetId", CommentController.create);

module.exports = router;
