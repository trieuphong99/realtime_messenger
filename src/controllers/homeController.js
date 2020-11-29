import {contact, message, notification} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimeStampToRealTime} from "./../helpers/clientHelper";

let getHome = async (req, res) => {
  // only 10 notifications received
  let notifications = await notification.getNotifications(req.user._id);

  // get notifications unread
  let countNotifUnread = await notification.countNotifUnread(req.user._id);

  // get contacts (10 items)
  let contacts = await contact.getContacts(req.user._id);

  // get sent contacts (10 items)
  let sentContacts = await contact.getSentContacts(req.user._id);

  // get received contacts (10 items)
  let receivedContacts = await contact.getReceivedContacts(req.user._id);

  // count contacts
  let countAllContacts = await contact.countAllContacts(req.user._id);
  let countAllSentContacts = await contact.countAllSentContacts(req.user._id);
  let countAllReceivedContacts = await contact.countAllReceivedContacts(req.user._id);

  let getAllConversations = await message.getAllConversationItems(req.user._id);
  let allConversationsWithMessages = getAllConversations.allConversationsWithMessages;
  
  // return data for views part
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
    notifications: notifications,
    countNotifUnread: countNotifUnread,
    contacts: contacts,
    sentContacts: sentContacts,
    receivedContacts: receivedContacts,
    countAllContacts: countAllContacts,
    countAllSentContacts: countAllSentContacts,
    countAllReceivedContacts: countAllReceivedContacts,
    allConversationsWithMessages: allConversationsWithMessages,
    bufferToBase64: bufferToBase64,
    lastItemOfArray: lastItemOfArray,
    convertTimeStampToRealTime: convertTimeStampToRealTime
  });
};

module.exports = {
  getHome: getHome
};