const TweetController = require("./../../../controllers/tweet_controller");
const TweetModel = require("./../../../database/models/tweet_model");

describe("TweetController", ()=>{
    describe("index()", ()=>{
        test("calls res.render()", async()=>{
            const res = {
                render: jest.fn()
            };

            const tweets = [];
            TweetModel.find = jest.fn().mockResolvedValue(tweets);

            await TweetController.index(null, res);
            expect(TweetModel.find).toBeCalledTimes(1);
            expect(res.render).toHaveBeenLastCalledWith("tweets/index", { tweets }); //make sure args were passed to the function.
        })

    });
});