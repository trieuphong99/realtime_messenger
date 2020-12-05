import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let checkMessageLength = [
  check("messageVal", transValidation.incorrect_message_text_emoji)
    .isLength({min: 1, max: 100})
];

module.exports = {
  checkMessageLength: checkMessageLength
}