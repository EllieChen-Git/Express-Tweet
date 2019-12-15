const mongoose = require("mongoose");
const UserSchema = require("../schemas/user_schema");

const UserModel = mongoose.model("user", UserSchema);
//1st arg: user collection, 2nd: schema where we wanna create model from

module.exports = UserModel;