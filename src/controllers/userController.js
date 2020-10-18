import multer from "multer";
import { transError, transSuccess } from "../../lang/vi";
import {app} from "./../config/app";
import uuidv4 from "uuid/v4";
import { user } from "../services/index";
import fsExtra from "fs-extra";

let storeAvatar = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.avatar_directory);
  },
  filename: (req, file, callback) => {
    let math = app.avatar_type;
    if(math.indexOf(file.mimetype) === -1) {
      return callback(transError.avatar_type_error, null);
    }
    let avatarName = `${Date.now()}-${uuidv4}-${file.originalname}`;
    callback(null, avatarName);
  }
});

let avatarUploadFile = multer({
  storage: storeAvatar,
  limits: {fieldSize: app.avatar_limit_size}
}).single("avatar");

let updateAvatar = (req, res) => {
  avatarUploadFile(req, res, async (error) => {
    if(error){
      if(error.message) {
        return res.status(500).send(transError.avatar_size_error);
      }
      return res.status(500).send(error);
    }
    try {
      let userUpdateItem = {
        avatar: req.file.filename,
        updateAt: Date.now()
      };
      // update user's avatar
      let userUpdate = await user.updateUser(req.user._id, userUpdateItem);

      // remove old avatar
      await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);

      let result = {
        message:transSuccess.avatar_updated,
        imageSrc: `/images/users/${req.file.filename}`
      }
      return res.status(200).send(result)
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

module.exports = {
  updateAvatar: updateAvatar
}