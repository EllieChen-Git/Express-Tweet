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

function loginNew(req, res){
    res.render("authentication/login");
}

async function loginCreate(req, res){
    const { email, password} = req.body;
    const user = await UserModel.findOne({ email });

    //If user not existed in db, render login page with err msg
    if(!user){
        return res.render("authentication/login", {error: "Invalid email & password"});
    }

     //If password invalid, render login page with err msg
    const valid = await user.verifyPassword(password);
    //verifyPassword: method from Mongoose-bcrypt 
    if(!valid){
        return res.render("authentication/login", {error: "Invalid email & password"})
    }

    //If there's user & valid password, redirect to dashboard
    req.session.user = user;
    res.redirect("/dashboard")
}

function logout(req, res) {
    req.session.destroy(() => {
        res.redirect("/");
    });
}


module.exports = {
    registerNew,
    registerCreate,
    logout,
    loginNew,
    loginCreate
};