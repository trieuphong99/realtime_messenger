import {pushSocketIdToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io library 
 */

let userOnlineOffline = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    // push socket id to clients' user id
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.request.user.chatGroupIds.forEach(group => {
      clients = pushSocketIdToArray(clients, group._id, socket.id);
    });

    let OnlineUsersList = Object.keys(clients);
    // step 01: emit to user after login or refresh web page
    socket.emit("server-send-list-users-online", OnlineUsersList);

    // step 02: emit to other users when new user online
    socket.broadcast.emit("server-send-when-new-user-online", currentUserId);

    // remove socket id once socket is disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
      socket.request.user.chatGroupIds.forEach(group => {
        clients = removeSocketIdFromArray(clients, group._id, socket);
      });
      // step 03: emit to other users when an user offline
      socket.broadcast.emit("server-send-when-an-user-offline", currentUserId);
    });
  });
};

module.exports = userOnlineOffline;