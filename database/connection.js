const mongoose = require("mongoose");

//Database
// async function connect(dbName){
//     await mongoose.connect(`mongodb://localhost/${dbName}`, { 
//         useNewUrlParser: true,
//         useUnifiedTopology: true 
//     });
//     mongoose.Promise = global.Promise;
//     mongoose.connection.on("error", (error)=> {console.log(error)});
//     return mongoose;
// }

mongoose.connect(process.env.DB_HOST, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true });
mongoose.Promise = global.Promise;
mongoose.connection.on("error", console.log);


// module.exports = connect;