import passport from "passport";
import passportFacebook from "passport-facebook";
import { transError, transSuccess } from "../../../lang/vi";
import userModel from "../../models/userModel";
import chatGroupModel from "../../models/chatGroupModel";

let facebookStrategy = passportFacebook.Strategy;

let facebookAppID = process.env.FACEBOOK_APP_ID;
let facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
let facebookCallbackUrl = process.env.FACEBOOK_CALLBACK_URL;

/**
 * valid user account type local
 */

let initPassportFacebook = () => {
  passport.use(
    new facebookStrategy(
      {
        // the "email", "password" terms are the name tag in login html file
        clientID: facebookAppID,
        clientSecret: facebookAppSecret,
        callbackURL: facebookCallbackUrl,
        passReqToCallback: true,
        profileFields: ["email", "gender", "displayName"],
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findByFacebookUid(profile.id);
          if (user) {
            return done(
              null,
              user,
              req.flash("success", transSuccess.loginSuccess(user.username))
            );
          }

          let newUserItem = {
            username: profile.displayName,
            gender: profile.gender,
            local: { isActive: true },
            facebook: {
              uid: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
            },
          };
          let newUser = await userModel.createNew(newUserItem);
          return done(
            null,
            newUser,
            req.flash("success", transSuccess.loginSuccess(newUser.username))
          );
        } catch (error) {
          console.log(error);
          return done(
            null,
            false,
            req.flash("errors", transError.server_error)
          );
        }
      }
    )
  );

  // save user's id to session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findUserByIdForSession(id);
      let getChatGroupIds = await chatGroupModel.getChatGroupIdsByUser(
        user._id
      );

      user = user.toObject();
      user.chatGroupIds = getChatGroupIds;

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
    userModel
      .findUserByIdForSession(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error, null);
      });
  });
};

module.exports = initPassportFacebook;
