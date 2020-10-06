export const transValidation = {
  incorrect_email: "unacceptable email",
  incorrect_gender: "are u gay?",
  incorrect_password: "your secret unmatches with our conditions, please enter at least 5 chars including upper, lower case, number and special char",
  incorrect_password_confirmation: "please enter the password confirmation exactly"
};

export const transError = {
  account_in_use: "Email is existed!",
  account_removed: "account is removed. If there's something wrong, please contact to our customer support team",
  account_not_activated: "account is not activated yet, please contact to our customer support team"
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Your account <strong>${userEmail}</strong> has been created! Please check your email for verifying your account.`
  }
}