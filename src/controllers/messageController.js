import { validationResult } from "express-validator/check";
import { message } from "./../services/index";
import multer from "multer";
import { transError, transSuccess } from "../../lang/vi";
import { app } from "./../config/app";
import fsExtra from "fs-extra";
import ejs from "ejs";
import {
  lastItemOfArray,
  convertTimeStampToRealTime,
  bufferToBase64,
} from "./../helpers/clientHelper";
import { promisify } from "util";

// make ejs function renderFile available with async await
const renderFile = promisify(ejs.renderFile).bind(ejs);

// handle text
let addNewTextEmoji = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach((item) => {
      errorArr.push(item.msg);
    });
    return res.status(500).send(errorArr);
  }

  try {
    let sender = {
      id: req.user._id,
      name: req.user.username,
      avatar: req.user.avatar,
    };

    let receiverId = req.body.uid;
    let messageVal = req.body.messageVal;
    let isChatGroup = req.body.isChatGroup;

    let newMessage = await message.addNewTextEmoji(
      sender,
      receiverId,
      messageVal,
      isChatGroup
    );

    return res.status(200).send({ message: newMessage });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// handle image upload
let storeImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let math = app.image_message_type;
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transError.image_message_type_error, null);
    }
    let imageName = `${file.originalname}`;
    callback(null, imageName);
  },
});

let imageMessageUploadFile = multer({
  storage: storeImageChat,
  limits: { fileSize: app.image_message_limit_size },
}).single("my-image-chat");

let addNewImage = (req, res) => {
  imageMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transError.image_message_size_error);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewImage(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      // remove image cause this image is already saved in mongodb
      await fsExtra.remove(
        `${app.image_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

// handle attachment upload
let storeAttachmentChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.attachment_message_directory);
  },
  filename: (req, file, callback) => {
    let attachmentName = `${file.originalname}`;
    callback(null, attachmentName);
  },
});

let attachmentMessageUploadFile = multer({
  storage: storeAttachmentChat,
  limits: { fileSize: app.attachment_message_limit_size },
}).single("my-attachment-chat");

let addNewAttachment = (req, res) => {
  attachmentMessageUploadFile(req, res, async (error) => {
    if (error) {
      if (error.message) {
        return res.status(500).send(transError.attachment_message_size_error);
      }
      return res.status(500).send(error);
    }
    try {
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar,
      };

      let receiverId = req.body.uid;
      let messageVal = req.file;
      let isChatGroup = req.body.isChatGroup;

      let newMessage = await message.addNewAttachment(
        sender,
        receiverId,
        messageVal,
        isChatGroup
      );

      // remove attachment cause this attachment is already saved in mongodb
      await fsExtra.remove(
        `${app.attachment_message_directory}/${newMessage.file.fileName}`
      );

      return res.status(200).send({ message: newMessage });
    } catch (error) {
      return res.status(500).send(error);
    }
  });
};

let readMoreAllChat = async (req, res) => {
  try {
    // get skip number from query param
    let skipPersonal = +req.query.skipPersonal;
    let skipGroup = +req.query.skipGroup;

    // get more items
    let newAllConversations = await message.readMoreAllChat(
      req.user._id,
      skipPersonal,
      skipGroup
    );

    let dataToRender = {
      newAllConversations: newAllConversations,
      lastItemOfArray: lastItemOfArray,
      convertTimeStampToRealTime: convertTimeStampToRealTime,
      bufferToBase64: bufferToBase64,
      user: req.user,
    };

    let leftSideData = await renderFile(
      "src/views/main/readMoreConversations/_leftSide.ejs",
      dataToRender
    );
    let rightSideData = await renderFile(
      "src/views/main/readMoreConversations/_rightSide.ejs",
      dataToRender
    );
    let imageModalData = await renderFile(
      "src/views/main/readMoreConversations/_imageModal.ejs",
      dataToRender
    );
    let attachmentModalData = await renderFile(
      "src/views/main/readMoreConversations/_attachmentModal.ejs",
      dataToRender
    );

    return res.status(200).send({
      leftSideData: leftSideData,
      rightSideData: rightSideData,
      imageModalData: imageModalData,
      attachmentModalData: attachmentModalData,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage,
  addNewAttachment: addNewAttachment,
  readMoreAllChat: readMoreAllChat,
};
