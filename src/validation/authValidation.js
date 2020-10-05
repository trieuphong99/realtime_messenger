import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let register = [
  check("email", transValidation.incorrect_email)
    .isEmail()
    .trim(),
  check("gender", transValidation.incorrect_gender)
    .isIn(["male", "female"]),
  check("password", transValidation.incorrect_password)
    .isLength({min: 6})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("password_confirmation", transValidation.incorrect_password_confirmation)
    .custom((value, {req}) => {
      return value === req.body.password;
    })
];

module.exports = {
  register: register,
}