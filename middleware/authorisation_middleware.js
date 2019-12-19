function authRedirect(req, res, next) {
    if (req.user) {
        return res.redirect("/register");
    }
    return next();
}

// function authorise(req, res, next){
//     if(req.user){
//         return res.redirect("/dashboard");    
//         return res.render("pages/dashboard"); //change to render to avoid continuing re-directing
//     }
//     return next();
// }

module.exports = {
    authRedirect,
    // authorise
}

