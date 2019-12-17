const UserModel = require("./../database/models/user_model");

function registerNew(req, res){
    res.render("authentication/register");
}

async function registerCreate(req, res) {
    const { email, password } = req.body;
    const user = await UserModel.create({ email, password });
    req.session.user = user;
    // res.redirect("/dashboard");

    // res.render("users/edit", { user }) //Can achieve the same result with .render
    res.redirect(`/users/${user._id}/edit`); 
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/");
    });
}


module.exports = {
    registerNew,
    registerCreate,
    logout
};