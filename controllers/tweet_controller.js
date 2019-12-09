const tweets = [];

function index(req, res){
    res.render("tweets/index", { tweets }); //{ tweets }: short hand when an obj's key is same as value
}

function create(req, res){
    const { username, post } = req.body;
    const tweet = {username, post };
    tweets.push(tweet);

    res.redirect("/tweets");
}

function newResource(req, res){
    res.render("tweets/form");
}

module.exports = {
    index,
    create,
    newResource
}