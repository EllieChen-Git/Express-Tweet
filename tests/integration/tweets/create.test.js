const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("./../../../app");  //Require our Express App

//Jest: set up DB connection before the test
beforeAll(()=>{ 
    mongoose.connect("mongodb://localhost/tweet_app", { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    mongoose.Promise = global.Promise;
    mongoose.connection.on("error", (err)=> {console.log(err)});
})

//Jest: close DB connection after the test
afterAll(()=> { 
    mongoose.connection.close();
})

//Our actual test here
describe("User creates a new tweet", ()=>{
    test("POST /tweets with a valid req bodoy", async()=>{
        const response = await supertest(app) //Using supertest to run our app
        .post("/tweets")          //creating post request
        .send({
            username: "testingEllie",
            post: "integration testing"
        })
        .expect(302); //Expect: supertest assertion to check res status code. 

        expect(response.body).toEqual({});
        //Once req is finished, we assert that the res body was empty 
        expect(response.headers.location).toMatch(/^\/tweets\/.*$/);
        //the headers location value was “/tweets/:id” because this route redirects to a single tweet once it has been created.(depends on create func on controller)
    });
});