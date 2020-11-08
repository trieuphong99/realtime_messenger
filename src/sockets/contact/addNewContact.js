/**
 * 
 * @param io from socket.io library 
 */

let addNewContact = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-new-contact", (data) => { // "add-new-contact" event, data(contactId) is from addContact.js script
      console.log(data);
      console.log(socket.request.user);
    });
  });
};

module.exports = addNewContact;