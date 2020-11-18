import {pushSocketIdToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io library 
 */

let addNewContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    // push socket id to clients' user id
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id)

    socket.on("add-new-contact", (data) => { // "add-new-contact" event, data(contactId) is from addContact.js script
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };
    
      if(clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("add-new-contact-response", currentUser);
        });
      }
    });

    // remove socket id once socket is disconnected
    socket.on("disconnect", () => {
      clients = removeSocketIdFromArray(clients, currentUserId, socket);
    });
    console.log(clients);
  });
};

module.exports = addNewContact;