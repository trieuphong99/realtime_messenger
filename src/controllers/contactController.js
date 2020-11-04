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
    let contactId = req.body.uid;

    let newContact = await contact.addNew(currentUserId, contactId);
    console.log(newContact);
    console.log(!!newContact);
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
}

module.exports = {
  findUsersContact: findUsersContact,
  addNew: addNew,
  removeRequest: removeRequest
}