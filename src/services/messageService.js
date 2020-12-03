import contactModel from "./../models/contactModel";
import userModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import messageModel from "./../models/messageModel";
import _ from "lodash";
import {transError} from "./../../lang/vi";
import app from "./../config/app";

const LIMIT_TAKEN_CONVERSATIONS = 10;
const LIMIT_TAKEN_MESSAGES = 10;

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

      let allConversationsWithMessagesPromise = allConversations.map(async (conversation) => {
        conversation = conversation.toObject();
        if(conversation.members) {
          let getMessages = await messageModel.model.getGroupMessages(conversation._id, LIMIT_TAKEN_MESSAGES);
          conversation.messages = getMessages; // create messages field
        } else {
          let getMessages = await messageModel.model.getPersonalMessages(currentUserId, conversation._id, LIMIT_TAKEN_MESSAGES);
          conversation.messages = getMessages; // create messages field
        }

        return conversation;
      });

      let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
      // descending sort by updatedAt
      allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item) => {
        return -item.updatedAt;
      });

      resolve({
        allConversationsWithMessages: allConversationsWithMessages
      });
    } catch (error) {
      reject(error); 
    }
  });
};

/**
 * 
 * @param {object} sender current user
 * @param {string} receiverId 
 * @param {string} messageVal 
 * @param {boolean} isChatGroup 
 */
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise((resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transError.conversation_not_found);
        };

        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.chat_group_avatar
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: chatGroupModel.conversationTypes.GROUP,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        }

        let newMessage = await messageModel.model.createNew(newMessageItem);

        // update chat group
        await chatGroupModel.updateWhenNewMessageDelivered(getChatGroupReceiver._id,
          getChatGroupReceiver.messageAmount + 1);
        resolve(newMessage);
      } else {
        let getUserReceiver = await userModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transError.conversation_not_found);
        };

        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar
        };
        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: chatGroupModel.conversationTypes.PERSONAL,
          messageType: messageModel.messageTypes.TEXT,
          sender: sender,
          receiver: receiver,
          text: messageVal,
          createdAt: Date.now()
        };

        let newMessage = await messageModel.model.createNew(newMessageItem);

        //update contact's date to get it on top of the list of contacts
        await contactModel.updateWhenNewMessageDelivered(sender.id, getUserReceiver._id);
        resolve(newMessage);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllConversationItems: getAllConversationItems,
  addNewTextEmoji: addNewTextEmoji
}