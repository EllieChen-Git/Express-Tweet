const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");


//serializeUser: stores info inside of our session relating to the passport user. 
passport.serializeUser((user, done) => {
    done(null, user._id);
});


//deserializeUser(): gives us access to the info stored within the passport.user property of our session and allows us to return back data from the database that will be appended to req.user.
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});



//LocalStrategy: 1st arg configuration object'usernameField:', 2nd  callback function'async (email, password, done)'
passport.use(new LocalStrategy({
    usernameField: "email"
},
async (email, password, done) => {
    const user = await UserModel.findOne({ email })
        .catch(done);
    if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
    }
    return done(null, user);
}
));


module.exports = passport;