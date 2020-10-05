import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transError, transSuccess} from "./../../lang/vi";
import { reject, resolve } from "bluebird";

let saltRounds = 7;

let register = (email, gender, password) => {
  return new Promise( async (resolve, reject) => {
    let userByEmail = await userModel.findByEmail(email);
    if(userByEmail) {
      if(userByEmail.deleteAt != null) {
        return reject(transError.account_removed);
      }
      if(!userByEmail.local.isActive) {
        return reject(transError.account_not_activated);
      }
      return reject(transError.account_in_use);
    }

    let salt = bcrypt.genSaltSync(saltRounds);

    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password, salt),
        verifyToken: uuidv4()
      }
    };
    let user = await userModel.create(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = {
  register: register
}