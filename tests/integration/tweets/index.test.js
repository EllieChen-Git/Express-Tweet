const request = require("supertest");
const app = require("./../../../app");
require("./../../setup");

describe("Received all tweets", ()=>{
    test("GET /tweets", async()=>{
        const response = await request(app).get("/tweets").expect(200);
    });
});