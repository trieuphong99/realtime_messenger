import express, { Router } from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/facebook";
import initPassportGoogle from "../controllers/passportController/google";
import passport from "passport";

// init passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

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
  router.get("/auth/facebook", auth.checkLoggedout, passport.authenticate("facebook", {scope: ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedout, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/auth/google", auth.checkLoggedout, passport.authenticate("google", {scope: ["email"]}));
  router.get("/auth/google/callback", auth.checkLoggedout, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register"
  }));

  router.get("/logout", auth.checkLoggedin, auth.getLogout);
  return app.use("/", router);
};

module.exports = initRoutes;