import {pushSocketIdToArray, removeSocketIdFromArray} from "./../../helpers/socketHelper";
/**
 * 
 * @param io from socket.io library 
 */

let deleteContact = (io) => {
  let clients = {};
  io.on("connection", (socket) => {
    
    let currentUserId = socket.request.user._id;
    clients = pushSocketIdToArray(clients, currentUserId, socket.id);

    socket.on("delete-contact", (data) => { // "add-new-contact" event, data(contactId) is from addContact.js script
      let currentUser = {
        id: socket.request.user._id
      };
    
      if(clients[data.contactId]) {
        clients[data.contactId].forEach(socketId => {
          io.sockets.connected[socketId].emit("delete-contact-response", currentUser);
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

module.exports = deleteContact;