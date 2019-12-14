const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const TweetSchema = new Schema({
    username: {          
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

TweetSchema.pre("save", next =>{
    let now = new Date();
    if(!this.createAt){
        this.createAt = now;
    }
    next();
})


module.exports = TweetSchema; //schema is not a model: we trun some schemas into models

