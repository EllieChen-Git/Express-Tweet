// const mongoose = require("mongoose");
// const Schema = mongoose.Schema; 

const { Schema } = require("mongoose");


const UserSchema = new Schema({
    name: {          
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        bcrypt: true
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

UserSchema.plugin(require("mongoose-bcrypt"));

module.exports = UserSchema; //schema is not a model: we trun some schemas into models

