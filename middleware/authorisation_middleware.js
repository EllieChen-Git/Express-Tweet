function authRedirect(req, res, next) {
    //check if there's a session & there's a user property on the session
    // if (req.session && req.session.user) {
    //     return next();
    // }
    // res.redirect("/dashboard");

    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    return next();
}

function authorise(req, res, next){
    if(req.session.user){
        return next();
    }
    return res.redirect("/");
}

module.exports = {
    authRedirect,
    authorise
}

