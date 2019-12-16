const request = require("supertest");
const app = require("./../../../app");  //Require our Express App
require("./../../setup")

//Our actual test here
describe("User creates a new tweet", ()=>{
    test("POST /tweets with a valid req bodoy", async()=>{
        const response = await request(app) //Using supertest to run our app
        .post("/tweets")          //creating post request
        .send({
            username: "testingEllie",
            post: "integration testing"
        })
        .expect(302); //Expect: supertest assertion to check res status code. 

        expect(response.body).toEqual({});
        //Once req is finished, we assert that the res body was empty 

        // expect(response.headers.location).toMatch(/^\/tweets\/.*$/);
        //the headers location value was “/tweets/:id” because this route redirects to a single tweet once it has been created.(depends on create func on controller)
        expect(response.headers.location).toMatch("/tweets");
    });
});