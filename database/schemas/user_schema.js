const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const UserSchema = new Schema({
    name: {          
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non binary'],
        default: 'non binary'
    }
});

module.exports = UserSchema; //schema is not a model: we trun some schemas into models

