import passport from "passport";
import passportLocal from "passport-local";
import { transError, transSuccess } from "../../../lang/vi";
import userModel from "../../models/userModel";

let localStrategy = passportLocal.Strategy;

/**
 * valid user account type local
 */

 let initPassportLocal = () => {
  passport.use(new localStrategy({
    // the "email", "password" terms are the name tag in login html file
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req, email, password, done) => {
    try {
      let user = await userModel.findByEmail(email);
      if(!user) {
        return done(null, false, req.flash("errors", transError.login_failed));
      }
      if(!user.local.isActive) {
        return done(null, false, req.flash("errors", transError.account_not_activated));
      }

      let checkPassword = await user.comparePassword(password);
      if(!checkPassword) {
        return done(null, false, req.flash("errors", transError.login_failed));
      }
      return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
    } catch (error) {
      console.log(error);
      return done(null, false, req.flash("errors", transError.server_error));
    }
  }));

  // save user's id to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    userModel.findUserByIdForSession(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  })
 };

 module.exports = initPassportLocal;