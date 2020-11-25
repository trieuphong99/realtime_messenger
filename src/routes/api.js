import express from "express";
import {home, auth, user, contact, notification} from "./../controllers/index";
import {authValid, userValid, contactValid} from "./../validation/index";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";
import passport from "passport";

// init passport
initPassportLocal();
initPassportFacebook();

let router = express.Router();

/**
 * init all routes
 * @param app from exactly express
 */

let initRoutes = (app) => {
  router.get("/", auth.checkLoggedin, home.getHome);
  router.get("/login-register", auth.checkLoggedout, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedout, authValid.register, auth.postRegister);
  router.get("/verify/:token", auth.checkLoggedout, auth.verifyAccount);
  router.post("/login", auth.checkLoggedout, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));
  router.get("/auth/facebook", passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/logout", auth.checkLoggedin, auth.getLogout);
  router.put("/user/update-avatar", auth.checkLoggedin, user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedin, userValid.updateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedin, userValid.updatePassword, user.updatePassword);

  router.get("/contact/find-users/:keyword", auth.checkLoggedin, contactValid.findUsersContact, contact.findUsersContact);
  router.post("/contact/add-new", auth.checkLoggedin, contact.addNew);
  router.delete("/contact/remove-contact-request", auth.checkLoggedin, contact.removeRequest);
  router.delete("/contact/remove-received-contact-request", auth.checkLoggedin, contact.removeReceivedRequest);
  router.delete("/contact/delete-contact", auth.checkLoggedin, contact.deleteContact);
  router.put("/contact/approve-received-contact-request", auth.checkLoggedin, contact.approveReceivedRequest);
  router.get("/contact/read-more-contacts", auth.checkLoggedin, contact.readMoreContacts);
  router.get("/contact/read-more-sent-contacts", auth.checkLoggedin, contact.readMoreSentContacts);
  router.get("/contact/read-more-received-contacts", auth.checkLoggedin, contact.readMoreReceivedContacts);

  router.get("/notification/read-more", auth.checkLoggedin, notification.readMore);
  router.put("/notification/mark-all-as-read", auth.checkLoggedin, notification.markAllAsRead);
  return app.use("/", router);

};

module.exports = initRoutes;