import addNewContact from "./contact/addNewContact";
import removeContactRequest from "./contact/removeContactRequest";
import removeReceivedContactRequest from "./contact/removeReceivedContactRequest";
import approveReceivedContactRequest from "./contact/approveReceivedContactRequest";
import deleteContact from "./contact/deleteContact";
import chatTextEmoji from "./chat/chatTextEmoji";
import typingOn from "./chat/typingOn";
import typingOff from "./chat/typingOff";

/**
 * 
 * @param io from socket.io library 
 */
let initSockets = (io) => {
  addNewContact(io);
  removeContactRequest(io);
  removeReceivedContactRequest(io);
  approveReceivedContactRequest(io);
  deleteContact(io);
  chatTextEmoji(io);
  typingOn(io);
  typingOff(io);
}

module.exports = initSockets;