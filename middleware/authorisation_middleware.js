function authRedirect(req, res, next) {
    //check if there's a session & there's a user property on the session
    if (req.session && req.session.user) {
        return res.redirect("/dashboard");
    }

    return next();
}

module.exports = {
    authRedirect
}

