//This is now our server

require("dotenv").config();
require("./database/connection")

//App.js
const app = require("./app");

global.HTTPError = class HTTPError extends Error {
    constructor(statusCode, message) {
        super(message);
  
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HTTPError);
        }
        this.name = "HTTPError";
        this.statusCode = statusCode;
    }
};


//Port
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
}); 