import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transError, transMail, transSuccess} from "./../../lang/vi";
import { reject, resolve } from "bluebird";
import sendMail from "./../config/mailer";

let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
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
    
    let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
    sendMail(email, transMail.subject, transMail.template(linkVerify))
      .then(success => {
        resolve(transSuccess.userCreated(user.local.email));
      })
      .catch(async (error) => {
        console.log(error);
        await userModel.removeById(user._id);
        reject(transMail.failed_to_send);
      });
  });
};

let verifyToken = (token) => {
  return new Promise( async (resolve, reject) => {
    let userByToken = await userModel.findByToken(token);
    if(!userByToken) {
      return reject(transError.token_undefined);
    }
    await userModel.verify(token);
    resolve(transSuccess.account_activated);
  });
};

module.exports = {
  register: register,
  verifyToken: verifyToken
};