import passport from "passport";
import passportGoogle from "passport-google-oauth";
import { transError, transSuccess } from "../../../lang/vi";
import userModel from "../../models/userModel";

let googleStrategy = passportGoogle.OAuth2Strategy;

let googleAppID = process.env.GOOGLE_APP_ID;
let googleAppSecret = process.env.GOOGLE_APP_SECRET;
let googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;

/**
 * valid user account type google
 */

 let initPassportGoogle = () => {
  passport.use(new googleStrategy({
    clientID: googleAppID,
    clientSecret: googleAppSecret,
    callbackURL: googleCallbackUrl,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findByGoogleUid(profile.id);
      if(user) {
        return done(null, user, req.flash("success", transSuccess.loginSuccess(user.username)));
      }
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        google: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };
      let newUser = await userModel.createNew(newUserItem);
      return done(null, newUser, req.flash("success", transSuccess.loginSuccess(newUser.username)));
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
    userModel.findUserById(id)
      .then(user => {
        return done(null, user);
      })
      .catch(error => {
        return done(error, null);
      });
  })
 };

 module.exports = initPassportGoogle;