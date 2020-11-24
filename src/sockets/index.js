import addNewContact from "./contact/addNewContact";
import removeContactRequest from "./contact/removeContactRequest";
import removeReceivedContactRequest from "./contact/removeReceivedContactRequest";
import approveReceivedContactRequest from "./contact/approveReceivedContactRequest";

/**
 * 
 * @param io from socket.io library 
 */
let initSockets = (io) => {
  addNewContact(io);
  removeContactRequest(io);
  removeReceivedContactRequest(io);
  approveReceivedContactRequest(io);
}

module.exports = initSockets;