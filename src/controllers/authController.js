import {validationResult} from "express-validator/check";
import { transSuccess } from "../../lang/vi";
import {auth} from "./../services/index";

let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = async (req, res) => {
  let errorArr = [];
  let successArr = [];

  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
  try {
    let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password,
      req.protocol, req.get("host"));
    successArr.push(createUserSuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let verifyAccount = async (req, res) => {
  let errorArr = [];
  let successArr = [];
  try {
    let verifySuccess = await auth.verifyToken(req.params.token);
    successArr.push(verifySuccess);
    req.flash("success", successArr);
    return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors", errorArr);
    return res.redirect("/login-register");
  }
};

let getLogout = (req, res) => {
  req.logout(); // passport's function
  req.flash("success", transSuccess.logout_success);
  return res.redirect("/login-register");
};

let checkLoggedin = (req, res, next) => {
  if(!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
};

let checkLoggedout = (req, res, next) => {
  if(req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  verifyAccount: verifyAccount,
  getLogout: getLogout,
  checkLoggedin: checkLoggedin,
  checkLoggedout: checkLoggedout
};