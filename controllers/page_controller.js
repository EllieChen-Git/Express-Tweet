function index(req, res){
    req.session.views = req.session.views? req.session.views + 1 : 1;
    res.send(`Welcome to Express Tweets! You have viewed this page ${req.session.views} time(s)`);
}

function dashboard(req, res) {
    if (req.user){
        const email = req.user.email;
        res.render("pages/dashboard", { email });
    } else{
        res.redirect("/register");
    }
}


module.exports = {
    index,
    dashboard
};
