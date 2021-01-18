import {
  emitNotifyToArray,
  pushSocketIdToArray,
  removeSocketIdFromArray,
} from "./../../helpers/socketHelper";
/**
 *
 * @param io from socket.io library
 */

let chatAttachment = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to clients' user id
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("chat-attachment", (data) => {
      // "chat-text-emoji" event, data(contactId) is from addContact.js script
      if (data.groupId) {
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message: data.message,
        };

        if (clients[data.groupId]) {
          emitNotifyToArray(
            clients,
            data.groupId,
            io,
            "chat-attachment-response",
            response
          );
        }
      }

      if (data.contactId) {
        let response = {
          currentUserId: socket.request.user._id,
          message: data.message,
        };

        if (clients[data.contactId]) {
          emitNotifyToArray(
            clients,
            data.contactId,
            io,
            "chat-attachment-response",
            response
          );
        }
      }
    });

    // remove socket id once socket is disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
    });
  });
};

module.exports = chatAttachment;
