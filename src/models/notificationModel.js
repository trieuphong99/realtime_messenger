import mongoose from "mongoose";

let Schema = mongoose.Schema;

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: {type: Boolean, default: false},
  createdAt: {type: Number, default: Date.now}
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item)
  },

  removeRequestNotification(senderId, receiverId, type) {
    return this.deleteOne({
      $and: [
        {"senderId": senderId},
        {"receiverId": receiverId},
        {"type": type}
      ]
    }).exec();
  },

  /**
   * 
   * @param {string} userId 
   * @param {number} limit 
   */
  getUserByIdAndLimit(userId, limit) {
    return this.find({"receiverId": userId}).sort({"createdAt": -1}).limit(limit).exec();
  },

  /**
   * count all notifications unread
   * @param {string} userId
   */
  countNotifUnread(userId) {
    return this.count({
      $and: [
        {"receiverId": userId},
        {"isRead": false} 
      ]
    }).exec()
  },
}

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact"
};

const NOTIFICATION_CONTENTS = {
  getContent: (notificationType, isRead, userId, userName, userAvatar) => {
    if(notificationType === NOTIFICATION_TYPES.ADD_CONTACT) {
      if(!isRead) {
        return `<div class="notif-read-false" data-uid="${userId}">
              <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
              <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
      }
      return `<div data-uid="${userId}">
              <img class="avatar-small" src="images/users/${userAvatar}" alt=""> 
              <strong>${userName}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
    }
  }
};

module.exports = {
  model: mongoose.model("notification", NotificationSchema),
  types: NOTIFICATION_TYPES,
  contents: NOTIFICATION_CONTENTS
};