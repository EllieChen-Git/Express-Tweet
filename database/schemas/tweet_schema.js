const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const TweetSchema = new Schema({
    post: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
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

