function index(req, res){
    req.session.views = req.session.views? req.session.views + 1 : 1;
    res.send(`Welcome to Express Tweets! You have viewed this page ${req.session.views} time(s)`);
}

function dashboard(req, res){
    res.send("Welcome to Your Dashboard!")
}


module.exports = {
    index,
    dashboard
};
