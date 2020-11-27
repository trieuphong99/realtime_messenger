import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";

const LIMIT_TAKEN_CONVERSATIONS = 10;

let getAllConversationItems = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let contacts = await contactModel.getContacts(currentUserId, LIMIT_TAKEN_CONVERSATIONS);
      let listUsers = contacts.map(async (contact) => {
        if(contact.contactId == currentUserId) {
          let getUserByContact =  await userModel.getNormalUserDataById(contact.userId);
          getUserByContact.updatedAt = contact.updatedAt; // two variables have the same type 'Object'
          return getUserByContact;
        } else {
          let getUserByContact =  await userModel.getNormalUserDataById(contact.contactId);
          getUserByContact.updatedAt = contact.updatedAt;
          return getUserByContact;
        }
      });

      let userConversations = await Promise.all(listUsers);
      let groupConversations = await chatGroupModel.getChatGroups(currentUserId, LIMIT_TAKEN_CONVERSATIONS);
      let allConversations = userConversations.concat(groupConversations);

      allConversations = _.sortBy(allConversations, (item) => {
        return -item.updatedAt;
      });
      resolve({
        userConversations: userConversations,
        groupConversations: groupConversations,
        allConversations: allConversations
      });
    } catch (error) {
      reject(error); 
    }
  });

};

module.exports = {
  getAllConversationItems: getAllConversationItems
}