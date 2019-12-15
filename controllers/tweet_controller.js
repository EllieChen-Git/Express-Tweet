const TweetModel = require("./../database/models/tweet_model")
const UserModel = require("./../database/models/user_model")

async function index(req, res) {
    const tweets = await TweetModel.find();
    res.render("tweets/index", { tweets }); //{ tweets }: shorthand when an object's key is same as value
}

async function create(req, res) {
    let { user, post } = req.body;
    let tweet = await TweetModel.create({ user, post })
        .catch(err => res.status(500).send(err));

    res.redirect("/tweets");
    // res.redirect(`/tweets/${tweet._id}`);
}

async function newResource(req, res){
    let users = await UserModel.find().select("_id name");
    res.render("tweets/new", { users });
}

async function show(req, res){
    let { id } = req.params;
    let tweet = await TweetModel.findById(id).populate("user");
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
    let { user, post } = req.body;
    let { id } = req.params;
    await TweetModel.findByIdAndUpdate(id, { user, post });
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