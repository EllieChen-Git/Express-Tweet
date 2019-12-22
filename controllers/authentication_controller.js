const UserModel = require("./../database/models/user_model");
const jwt = require("jsonwebtoken");

function registerNew(req, res) {
  res.render("authentication/register");
}

async function registerCreate(req, res, next) {
  const { email, password } = req.body;
  const user = await UserModel.create({ email, password });

  req.login(user, err => {
    if (err) {
      return next(err);
    }
    // res.redirect("/dashboard")
    res.redirect(`/users/${user._id}/edit`);
  });
}

function loginNew(req, res) {
  res.render("authentication/login");
}

function loginCreate(req, res) {
  const token = jwt.sign({ sub: req.user._id }, process.env.JWT_SECRET); //passport append user to req.user
  res.cookie("jwt", token); //setting our JWT token as a cookie name JWT.
  res.redirect("/dashboard");
}

function logout(req, res) {
  req.logout();
  res.cookie("jwt", null, { maxAge: -1 }); //remove cookies from our browser by setting it expiration date to sometime in the past.
  res.redirect("/");
}

module.exports = {
  registerNew,
  registerCreate,
  logout,
  loginNew,
  loginCreate
};
