import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import _ from "lodash";

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await contactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    console.log(deprecatedUserIds);
    
    let users = await userModel.findAllForAddContact(deprecatedUserIds, keyword);
    resolve(users);
  });
}

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExistence = await contactModel.checkExistence(currentUserId, contactId);
    if(contactExistence) {
      return reject(false);
    }

    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    }
    let newContact = await contactModel.createNew(newContactItem);
    resolve(newContact);
  });
}

let removeRequest = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let removeReq = await contactModel.removeContactRequest(currentUserId, contactId);

    if(removeReq.n === 0) {
      return reject(false);
    }
    resolve(true);
  })
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequest: removeRequest
}