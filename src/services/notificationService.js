import { reject, resolve } from "bluebird";
import { notification } from ".";
import notificationModel from "./../models/notificationModel";
import userModel from "./../models/userModel";

const LIMIT_TAKEN_NUMBER = 3;

let getNotifications = (currentUserId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let notifications = await notificationModel.model.getUserByIdAndLimit(currentUserId, LIMIT_TAKEN_NUMBER);

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

/**
 * read 10 more notifications at the same time
 * @param {string} currentUserId
 * @param {number} skipNumberNotifications
 */
let readMore = (currentUserId, skipNumberNotifications) => {
  return new Promise(async (resolve, reject) => {
    try {
      let newNotifications = await notificationModel.model.readMore(currentUserId, skipNumberNotifications, LIMIT_TAKEN_NUMBER);
      resolve(newNotifications);
    } catch (error) {
      reject(error);
    }
  });
};

let markAllAsRead = (currentUserId, targetUsers) => {
  return new Promise(async (resolve, reject) => {
    try {
      await notificationModel.model.markAllAsRead(currentUserId, targetUsers);
      resolve(true);
    } catch (error) {
      console.log(`Something's wrong happened: ${error}`);
      reject(false);
    }
  });
}

module.exports = {
  getNotifications: getNotifications,
  countNotifUnread: countNotifUnread,
  readMore: readMore,
  markAllAsRead: markAllAsRead
}