const TweetModel = require("./../database/models/tweet_model")

async function index(req, res) {
    const tweets = await TweetModel.find();
    res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
    let { username, post } = req.body;
    let newTweet = await TweetModel.create({ username, post })
        .catch(err => res.status(500).send(err));

    // res.redirect("/tweets");
    res.redirect(`/tweets/${newTweet._id}`);
}

function newResource(req, res){
    res.render("tweets/new");
}

async function show(req, res){
    let { id } = req.params;
    let tweet = await TweetModel.findById(id);
    res.render("tweets/show", { tweet })

}

async function destroy(req, res){
    let { id } = req.params;
    await TweetModel.findByIdAndRemove(id);
    res.redirect("/tweets")
}

async function edit(req, res){
    let { id } = req.params;
    let tweet = await TweetModel.findById(id);

    res.render("tweets/edit", { tweet })
}

async function update(req, res){
    let { username, post } = req.body;
    let { id } = req.params;
    await TweetModel.findByIdAndUpdate(id, { username, post });

    res.redirect(`/tweets/${id}`);
}

module.exports = {
    index,
    create,
    newResource,
    show,
    destroy,
    edit,
    update
}