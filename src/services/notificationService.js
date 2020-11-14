import { notification } from ".";
import notificationModel from "./../models/notificationModel";
import userModel from "./../models/userModel";

let getNotifications = (currentUserId, limit = 10) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await notificationModel.model.getUserByIdAndLimit(currentUserId, limit);

      let getNotifContents = notifications.map(async (notification) => { // notification is each element of "notifications"
        let sender = await userModel.findUserById(notification.senderId);
        return notificationModel.contents.getContent(notification.type, notification.isRead, sender._id, sender.username, sender.avatar);
      });
      resolve(await Promise.all(getNotifContents));
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * count all notifications unread
 * @param {string} currentUserId 
 */
let countNotifUnread = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notificationsUnread = await notificationModel.model.countNotifUnread(currentUserId);
      resolve(notificationsUnread);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread
}