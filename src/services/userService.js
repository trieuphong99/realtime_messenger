import { transError } from "../../lang/vi";
import userModel from "./../models/userModel";
import bcrypt from "bcrypt";

const saltRound = 7;
/**
 * update user's info
 * @param {userId} id 
 * @param {data_update} item 
 */
let updateUser = (id, item) => {
  return userModel.updateUser(id, item);
}

/**
 * update user's password
 * @param {userId} id
 * @param {password_update} dataUpdate
 */
let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve, reject) => {
    let currentUser = await userModel.findUserById(id);
    if(!currentUser){
      return reject(transError.account_undefined);
    }

    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    if(!checkCurrentPassword){
      return reject(transError.user_current_password_error);
    }

    let salt = bcrypt.genSaltSync(saltRound);
    await userModel.updatePassword(id, bcrypt.hashSync(dataUpdate.newPassword, salt));
    resolve(true);
  });
}

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
}