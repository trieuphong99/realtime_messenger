import addNewContact from "./contact/addNewContact";
import removeContactRequest from "./contact/removeContactRequest";
/**
 * 
 * @param io from socket.io library 
 */
let initSockets = (io) => {
  addNewContact(io);
  removeContactRequest(io);
}

module.exports = initSockets;