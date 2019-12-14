//This is now our server

const mongoose = require("mongoose");
const port = 3000;

//Database
mongoose.connect("mongodb://localhost/tweet_app", { 
    useNewUrlParser: true,
    useUnifiedTopology: true //use new Server Discover and Monitoring engine
});
mongoose.Promise = global.Promise;
mongoose.connection.on("error", (error)=> {console.log(error)});


//App.js
const app = require("./app"); //Require our app.js file here

//Port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
}); 