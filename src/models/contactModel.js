import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item)
  },

  /**
   * Find all items related to user
   * @param {string} userId 
   */

  findAllByUser(userId) {
    return this.find({
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  },

  checkExistence(userId, contactId) {
    return this.findOne({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and: [
          {"contactId": userId},
          {"userId": contactId}
        ]}
      ]
    })
  },

  removeContactRequest(userId, contactId) {
    return this.deleteOne({
      $and: [
        {"userId": userId},
        {"contactId": contactId},
        {"status": false}
      ]
    }).exec();
  },

  removeReceivedContactRequest(userId, contactId) {
    return this.deleteOne({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }).exec();
  },

  approveReceivedContactRequest(userId, contactId) {
    return this.update({
      $and: [
        {"contactId": userId},
        {"userId": contactId},
        {"status": false}
      ]
    }, {"status": true}).exec();
  },

  /**
   * get all user's contacts
   * @param {string} userId 
   * @param {number} limit 
   */
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * get contacts that user sent
   * @param {string} userId 
   * @param {number} limit 
   */
  getSentContacts(userId, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * get contacts that user received
   * @param {string} userId 
   * @param {number} limit 
   */
  getReceivedContacts(userId, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * count all user's contacts
   * @param {string} userId 
   */
  countAllContacts(userId) {
    return this.count({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).exec();
  },

  /**
   * count all contacts that user sent
   * @param {string} userId 
   */
  countAllSentContacts(userId) {
    return this.count({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).exec();
  },

  /**
   * count all contacts that user received
   * @param {string} userId 
   */
  countAllReceivedContacts(userId) {
    return this.count({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).exec();
  },

  readMoreContacts(userId, skipNumber, limit) {
    return this.find({
      $and: [
        {$or: [
          {"userId": userId},
          {"contactId": userId}
        ]},
        {"status": true}
      ]
    }).sort({"createdAt": -1}).skip(skipNumber).limit(limit).exec();
  },

  deleteContact(userId, contactId) {
    return this.remove({
      $or: [
        {$and: [
          {"userId": userId},
          {"contactId": contactId},
          {"status": true}
        ]},
        {$and: [
          {"contactId": userId},
          {"userId": contactId},
          {"status": true}
        ]}
      ]
    }).exec();
  },

  readMoreSentContacts(userId, skipNumber, limit) {
    return this.find({
      $and: [
        {"userId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skipNumber).limit(limit).exec();
  },

  readMoreReceivedContacts(userId, skipNumber, limit) {
    return this.find({
      $and: [
        {"contactId": userId},
        {"status": false}
      ]
    }).sort({"createdAt": -1}).skip(skipNumber).limit(limit).exec();
  },

};
module.exports = mongoose.model("contact", ContactSchema);