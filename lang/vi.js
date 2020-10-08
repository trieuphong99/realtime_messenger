export const transValidation = {
  incorrect_email: "unacceptable email",
  incorrect_gender: "are u gay?",
  incorrect_password: "your secret unmatches with our conditions, please enter at least 5 chars including upper, lower case, number and special char",
  incorrect_password_confirmation: "please enter the password confirmation exactly",
  login_failed: "wrong username or password",
  server_error: "something's wrong with server, please contact our customer support team"
};

export const transError = {
  account_in_use: "Email is existed!",
  account_removed: "account is removed. If there's something wrong, please contact our customer support team",
  account_not_activated: "account is not activated yet, please contact our customer support team",
  token_undefined: "token does not exist"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Your account <strong>${userEmail}</strong> has been created! Please check your email for verifying your account.`
  },
  account_activated: "Your account has been activated successfully",
  loginSuccess: (username) => {
    return `Wassup ${username}, welcome to Real-time Messenger`
  }
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


