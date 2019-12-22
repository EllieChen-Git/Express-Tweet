const passport = require("passport");
const LocalStrategy = require("passport-local");
const UserModel = require("./../database/models/user_model");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
//pull out Strategy & ExtractJwt & rename Strategy to JwtStrategy

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
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      session: false
    },
    async (email, password, done) => {
      const user = await UserModel.findOne({ email }).catch(done);
      if (!user || !user.verifyPasswordSync(password)) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: req => {
        let token = null; //if you don't find it, passport want a null instead of undefined

        if (req && req.cookies) {
          token = req.cookies["jwt"];
        }

        return token;
      },
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwt_payload, done) => {
      const user = await UserModel.findById(jwt_payload.sub).catch(done);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    }
  )
);

module.exports = passport;
