import mongoose from "mongoose";

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
  senderId: String,
  receiverId: String,
  conversationType: String,
  messageType: String,
  sender: {
    id: String,
    name: String,
    avatar: String
  },
  receiver: {
    id: String,
    name: String,
    avatar: String
  },
  text: String,
  file: {data: Buffer, contentType: String, fileName: String},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  /**
   * 
   * @param {string} senderId curentUserId
   * @param {string} receiverId id of contact
   */
  getPersonalMessages(senderId, receiverId, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"senderId": receiverId},
          {"receiverId": senderId}
        ]}
      ]
    }).sort({"createdAt": 1}).limit(limit).exec();
  },

  readMorePersonalMessages(senderId, receiverId, skip, limit) {
    return this.find({
      $or: [
        {$and: [
          {"senderId": senderId},
          {"receiverId": receiverId}
        ]},
        {$and: [
          {"senderId": receiverId},
          {"receiverId": senderId}
        ]}
      ]
    }).sort({"createdAt": 1}).skip(skip).limit(limit).exec();
  },

  /**
   * 
   * @param {string} receiverId id of chat group
   */
  getGroupMessages(receiverId, limit) {
    return this.find({"receiverId": receiverId}).sort({"createdAt": 1}).limit(limit).exec();
  },

  readMoreGroupMessages(receiverId, skip, limit) {
    return this.find({"receiverId": receiverId}).sort({"createdAt": 1}).skip(skip).limit(limit).exec();
  },
};

const MESSAGE_CONVERSATION_TYPES = {
  PERSONAL: "personal",
  GROUP: "group",
};

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file"
};

module.exports = {
  model: mongoose.model("message", MessageSchema),
  conversationTypes: MESSAGE_CONVERSATION_TYPES,
  messageTypes: MESSAGE_TYPES
};