import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let updateInfo = [
  check("username", transValidation.update_username)
    .optional()
    .isLength({min: 3, max: 17})
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transValidation.update_gender)
    .optional()
    .isIn(["male", "female"]),
  check("address", transValidation.update_address)
    .optional()
    .isLength({min: 3, max: 100}),
  check("phone", transValidation.update_phone)
    .optional()
    .matches(/^(0)[0-9]{9,10}$/),
];

let updatePassword = [
  check("currentPassword", transValidation.incorrect_password)
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("newPassword", transValidation.incorrect_password)
    .isLength({min: 8})
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
  check("confirmNewPassword", transValidation.incorrect_password_confirmation)
    .custom((value, {req}) => value === req.body.confirmNewPassword)
];

module.exports = {
  updateInfo: updateInfo,
  updatePassword: updatePassword
}