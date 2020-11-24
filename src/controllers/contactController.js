import {contact} from "./../services/index";
import {validationResult} from "express-validator/check";

let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);
  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    // logging
    // console.log(errorArr)
    return res.status(500).send(errorArr);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.params.keyword;

    let users = await contact.findUsersContact(currentUserId, keyword);
    return res.render("main/contact/sessions/_findUsersContact", {users});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let addNew = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid; // uid is the id of the searched user gotten from addContact function in addContact.js

    let newContact = await contact.addNew(currentUserId, contactId);
    return res.status(200).send({success: !!newContact});
  } catch (error) {
    return res.status(500).send(error);
  }
}

let removeRequest = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeRequest(currentUserId, contactId);
    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeReceivedRequest = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let removeReq = await contact.removeReceivedRequest(currentUserId, contactId);
    return res.status(200).send({success: !!removeReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let approveReceivedRequest = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let approveReq = await contact.approveReceivedRequest(currentUserId, contactId);
    return res.status(200).send({success: !!approveReq});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreContacts = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContacts = +(req.query.skipNumber);

    // get more items
    let newContacts = await contact.readMoreContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContacts);
  } catch (error) {
    return res.status(500).send(error);
  }
}

let readMoreSentContacts = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContacts = +(req.query.skipNumber);

    // get more items
    let newContacts = await contact.readMoreSentContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContacts);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreReceivedContacts = async (req, res) => {
  try {
    // get skip number from query param
    let skipNumberContacts = +(req.query.skipNumber);

    // get more items
    let newContacts = await contact.readMoreReceivedContacts(req.user._id, skipNumberContacts);
    return res.status(200).send(newContacts);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequest: removeRequest,
  removeReceivedRequest: removeReceivedRequest,
  approveReceivedRequest: approveReceivedRequest,
  readMoreContacts: readMoreContacts,
  readMoreSentContacts: readMoreSentContacts,
  readMoreReceivedContacts: readMoreReceivedContacts
}