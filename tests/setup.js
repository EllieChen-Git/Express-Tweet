const dbConnect = require("./../database/connection");

module.exports = (()=>{
    let mongoose;

    //Set up DB connection before the test
    beforeAll(async()=>{ 
        mongoose = await dbConnect("tweet_app_test");
    })

    //Close DB connection after the test
    afterAll(async()=>{
        await mongoose.connection.close();
    })
})()


