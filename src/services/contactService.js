import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import notificationModel from "./../models/notificationModel";
import _ from "lodash";

const LIMIT_TAKEN_NUMBER = 1;

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecatedUserIds = [currentUserId];
    let contactsByUser = await contactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
      deprecatedUserIds.push(contact.userId);
      deprecatedUserIds.push(contact.contactId);
    });
    deprecatedUserIds = _.uniqBy(deprecatedUserIds);
    
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

    // create contact
    let newContactItem = {
      userId: currentUserId,
      contactId: contactId
    }
    let newContact = await contactModel.createNew(newContactItem);

    // notification of new contact
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notificationModel.types.ADD_CONTACT,
    };
    await notificationModel.model.createNew(notificationItem);
    resolve(newContact);
  });
}

let removeRequest = (currentUserId, contactId) => { // remove contact request
  return new Promise(async (resolve, reject) => {
    let removeReq = await contactModel.removeContactRequest(currentUserId, contactId);

    if(removeReq.n === 0) {
      return reject(false);
    }

    // remove notification of contact

    await notificationModel.model.removeRequestNotification(currentUserId, contactId, notificationModel.types.ADD_CONTACT);
    resolve(true);
  })
};

let removeReceivedRequest = (currentUserId, contactId) => {  // remove received contact request
  return new Promise(async (resolve, reject) => {
    let removeReq = await contactModel.removeReceivedContactRequest(currentUserId, contactId);

    if(removeReq.n === 0) {
      return reject(false);
    }

    // remove notification of contact

    //await notificationModel.model.removeReceivedRequestNotification(currentUserId, contactId, notificationModel.types.ADD_CONTACT);
    resolve(true);
  })
};

let approveReceivedRequest = (currentUserId, contactId) => {  // approve received contact request
  return new Promise(async (resolve, reject) => {
    let approveReq = await contactModel.approveReceivedContactRequest(currentUserId, contactId);
    if(approveReq.nModified === 0) {
      return reject(false);
    }

    // notification of new contact
    let notificationItem = {
      senderId: currentUserId,
      receiverId: contactId,
      type: notificationModel.types.APPROVE_CONTACT,
    };
    await notificationModel.model.createNew(notificationItem);
    resolve(true);
  })
};

let deleteContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let deletedContact = await contactModel.deleteContact(currentUserId, contactId);

    if(deletedContact.n === 0) {
      return reject(false);
    }
    resolve(true);
  })
};

let getContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId, LIMIT_TAKEN_NUMBER);
      let listUsers = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          return await userModel.getNormalUserDataById(contact.userId);
        } else {
          return await userModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  })
};

let getSentContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getSentContacts(currentUserId, LIMIT_TAKEN_NUMBER);
      let listUsers = contacts.map(async (contact) => {
        return await userModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  })
};

let getReceivedContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getReceivedContacts(currentUserId, LIMIT_TAKEN_NUMBER);
      let listUsers = contacts.map(async (contact) => {
        return await userModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  })
};

let countAllContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  })
};

let countAllSentContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllSentContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  })
};

let countAllReceivedContacts = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let count = await contactModel.countAllReceivedContacts(currentUserId);
      resolve(count);
    } catch (error) {
      reject(error);
    }
  })
};

let readMoreContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await contactModel.readMoreContacts(currentUserId, skipNumberContacts, LIMIT_TAKEN_NUMBER);

      let listUsers = newContacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          return await userModel.getNormalUserDataById(contact.userId);
        } else {
          return await userModel.getNormalUserDataById(contact.contactId);
        }
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreSentContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newContacts = await contactModel.readMoreSentContacts(currentUserId, skipNumberContacts, LIMIT_TAKEN_NUMBER);

      let listUsers = newContacts.map(async (contact) => {
        return await userModel.getNormalUserDataById(contact.contactId);
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  });
};

let readMoreReceivedContacts = (currentUserId, skipNumberContacts) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.readMoreReceivedContacts(currentUserId, skipNumberContacts, LIMIT_TAKEN_NUMBER);
      let listUsers = contacts.map(async (contact) => {
        return await userModel.getNormalUserDataById(contact.userId);
      });
      resolve(await Promise.all(listUsers));
    } catch (error) {
      reject(error);
    }
  })
};

let searchFriends = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let friendIds = [];
    let friends = await contactModel.getFriends(currentUserId);
    friends.forEach(item => {
      friendIds.push(item.userId);
      friendIds.push(item.contactId);
    });

    friendIds = _.uniqBy(friendIds);
    friendIds =  friendIds.filter(userId => userId != currentUserId);

    let users = await userModel.findAllToAddGroupChat(friendIds, keyword);
    resolve(users);
  });
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequest: removeRequest,
  removeReceivedRequest: removeReceivedRequest,
  getContacts: getContacts,
  getSentContacts: getSentContacts,
  getReceivedContacts: getReceivedContacts,
  approveReceivedRequest: approveReceivedRequest,
  deleteContact: deleteContact,
  countAllContacts: countAllContacts,
  countAllSentContacts: countAllSentContacts,
  countAllReceivedContacts: countAllReceivedContacts,
  readMoreContacts: readMoreContacts,
  readMoreSentContacts: readMoreSentContacts,
  readMoreReceivedContacts: readMoreReceivedContacts,
  searchFriends: searchFriends,
}