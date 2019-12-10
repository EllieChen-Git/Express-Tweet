const mongoose = require("mongoose");
const Schema = mongoose.Schema; //'Schema' is capitalised here as it returns a 'class'

const TweetSchema = new Schema({
    //username: String    shorthand: but we don't use it as we prob need more properties 
    username: {           //longhand
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    }
});

module.exports = TweetSchema; //schema is not a model: we trun some schemas into models

