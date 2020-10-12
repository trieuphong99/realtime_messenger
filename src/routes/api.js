import express, { Router } from "express";
import {home, auth} from "./../controllers/index";
import {authValid} from "./../validation/index";
import initPassportLocal from "../controllers/passportController/local";
import passport from "passport";

// init passport local
initPassportLocal();

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
  router.get("/logout", auth.checkLoggedin, auth.getLogout);
  return app.use("/", router);
};

module.exports = initRoutes;