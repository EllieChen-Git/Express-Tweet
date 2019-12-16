const TweetModel = require("./../database/models/tweet_model")

async function create (req, res){
    let { tweetId } = req.params;
    let { body } = req.body;
    let tweet = await TweetModel.findById(tweetId);
    tweet.comments.push({ body });
    await tweet.save();

    res.redirect(`/tweets/${tweetId}`);
}

module.exports = { 
    create
};