export const transValidation = {
  incorrect_email: "unacceptable email",
  incorrect_gender: "are u gay?",
  incorrect_password: "your secret unmatches with our conditions, please enter at least 5 chars including upper, lower case, number and special char",
  incorrect_password_confirmation: "please enter the password confirmation exactly",
  account_undefined: "The account is not registered yet",
  update_username: "The username only limits to 3-17 characters and not includes special ones",
  update_gender: "Are you trying to do something suspicious?",
  update_phone: "The phone number is not valid in your country",
  update_address: "The address only limits to 10-100 characters",
  keyword_find_user: "You've entered wrong format of keyword, only accept number, syllable and space",
  incorrect_message_text_emoji: "Invalid message, make sure you enter at least 1 or 100 characters as maximum"
};

export const transError = {
  account_in_use: "Email is existed!",
  account_removed: "account is removed. If there's something wrong, please contact our customer support team",
  account_not_activated: "account is not activated yet, please contact our customer support team",
  token_undefined: "token does not exist",
  login_failed: "wrong username or password",
  server_error: "something's wrong with server, please contact our customer support team",
  avatar_type_error: "File type is not valid, only jpeg, jpg or png allowed",
  avatar_size_error: "File size must be less than 1MB",
  user_current_password_error: "You entered wrong password",
  conversation_not_found: "Conversation not found",
  image_message_type_error: "File type is not valid, only jpeg, jpg or png allowed",
  image_message_size_error: "File size must be less than 1MB",
  attachment_message_size_error: "File size must be less than 1MB",
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Your account <strong>${userEmail}</strong> has been created! Please check your email for verifying your account.`
  },
  account_activated: "Your account has been activated successfully",
  loginSuccess: (username) => {
    return `Wassup ${username}, welcome to Real-time Messenger`
  },
  logout_success: "Log out successfully, see you my dawg",
  user_info_updated: "Your information has been updated",
  user_password_updated: "Your password has been updated"
};

export const transMail = {
  subject: "Your account need to be confirmed",
  template: (linkVerify) => {
    return `
      <h2>You've just signed up a new Real-time Messenger account</h2>
      <h3>Please click here to verify</h3>
      <h3><a href="${linkVerify}" target="blank">${linkVerify}</a></h3>`
  },
  failed_to_send: "Sorry, there's something wrong with the mail delivery, please contact our customer support team"
};


