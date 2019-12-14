//This is now our server


const dbConnect = require("./database/connection")
dbConnect("tweet_app")

//App.js
const app = require("./app"); //Require our app.js file here

//Port
const port = 3000;
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
}); 