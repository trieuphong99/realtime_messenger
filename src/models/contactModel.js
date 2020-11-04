import mongoose from "mongoose";
import { contact } from "../services";

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
        {"contactId": contactId}
      ]
    }).exec();
  }
};
module.exports = mongoose.model("contact", ContactSchema);