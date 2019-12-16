const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const CommentSchema = require("./comment_schema");

const TweetSchema = new Schema({
    post: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    user: {  //normalising
        type: Schema.Types.ObjectId,
        ref: "user"
    }, 
    comments: [CommentSchema]      //denormalising
});

module.exports = TweetSchema; //schema is not a model: we trun some schemas into models

