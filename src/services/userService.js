import userModel from "./../models/userModel";
/**
 * update user's info
 * @param {userId} id 
 * @param {data_update} item 
 */
let updateUser = (id, item) => {
  return userModel.updateUser(id, item);
}

module.exports = {
  updateUser: updateUser
}