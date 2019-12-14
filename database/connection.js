const mongoose = require("mongoose");

//Database
async function connect(dbName){
    await mongoose.connect(`mongodb://localhost/${dbName}`, { 
        useNewUrlParser: true,
        useUnifiedTopology: true 
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on("error", (error)=> {console.log(error)});
    return mongoose;
}

module.exports = connect;