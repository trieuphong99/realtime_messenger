import {pushSocketIdToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io library 
 */

let approveReceivedContactRequest = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    // push socket id to clients' user id
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id)

    socket.on("approve-received-contact-request", (data) => { // "approve-received-contact-request" event, data(contactId) is from approveReceivedContactRequest.js script
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };
    
      if(clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("approve-received-contact-request-response", currentUser);
        });
      }
    });

    // remove socket id once socket is disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
    });
  });
};

module.exports = approveReceivedContactRequest;