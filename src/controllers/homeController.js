import { contact, message, notification } from "./../services/index";
import {
  bufferToBase64,
  lastItemOfArray,
  convertTimeStampToRealTime,
} from "./../helpers/clientHelper";
import request from "request";

let getICETurnServer = () => {
  return new Promise(async (resolve, reject) => {
    // // Node Get ICE STUN and TURN list
    // let o = {
    //   format: "urls",
    // };

    // let bodyString = JSON.stringify(o);
    // let options = {
    //   url: "https://global.xirsys.net/_turn/app-trieu-phong",
    //   // host: "global.xirsys.net",
    //   // path: "/_turn/app-trieu-phong",
    //   method: "PUT",
    //   headers: {
    //     Authorization:
    //       "Basic " +
    //       Buffer.from(
    //         "trieuphong99:90ad7622-647d-11eb-9b27-0242ac150003"
    //       ).toString("base64"),
    //     "Content-Type": "application/json",
    //     "Content-Length": bodyString.length,
    //   },
    // };

    // // call a request to get ICE list of turn server
    // request(options, function(error, response, body) {
    //   if (error) {
    //     return reject(error);
    //   }
    //   let bodyJson = JSON.parse(body);
    //   resolve(bodyJson.v.iceServers);
    // });

    // let httpreq = https.request(options, function (httpres) {
    //   let str = "";
    //   httpres.on("data", function (data) {
    //     str += data;
    //   });
    //   httpres.on("error", function (e) {
    //     console.log("error: ", e);
    //   });
    //   httpres.on("end", function () {
    //     console.log("ICE List: ", str);
    //   });
    // });
    // httpreq.on("error", function (e) {
    //   console.log("request error: ", e);
    // });
    // httpreq.end();
    resolve([]);
  });
};

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
  let countAllReceivedContacts = await contact.countAllReceivedContacts(
    req.user._id
  );

  let getAllConversations = await message.getAllConversationItems(req.user._id);
  let allConversationsWithMessages = getAllConversations.allConversationsWithMessages;

  // get ice list from xirsys turn server
  let iceServerList = await getICETurnServer();

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
    convertTimeStampToRealTime: convertTimeStampToRealTime,
    iceServerList: JSON.stringify(iceServerList),
  });
};

module.exports = {
  getHome: getHome,
};
