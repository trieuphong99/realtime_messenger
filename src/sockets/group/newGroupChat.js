import {
  pushSocketIdToArray,
  emitNotifyToArray,
  removeSocketIdFromArray,
} from "./../../helpers/socketHelper";
/**
 *
 * @param io from socket.io library
 */

let newGroupChat = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    // push socket id to clients' user id
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.request.user.chatGroupIds.forEach((group) => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    socket.on("new-created-group", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id);

      let response = {
        groupChat: data.groupChat,
      };

      data.groupChat.members.forEach((member) => {
        if (clients[member.userId] && member.userId != currentUserId) {
          emitNotifyToArray(
            clients,
            member.userId,
            io,
            "new-created-group-response",
            response
          );
        }
      });
    });

    socket.on("member-joined-group-chat", (data) => {
      clients = pushSocketIdToArray(clients, data.groupChatId, socket.id);
    });

    // remove socket id once socket is disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach((group) => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
      // step 03: emit to other users when an user offline
      socket.broadcast.emit("server-send-when-an-user-offline", currentUserId);
    });
  });
};

module.exports = newGroupChat;
