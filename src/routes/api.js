import express, { Router } from "express";
import {home, auth, user} from "./../controllers/index";
import {authValid} from "./../validation/index";
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
  router.put("/user/update-info", auth.checkLoggedin, user.updateInfo);
  return app.use("/", router);

};

module.exports = initRoutes;