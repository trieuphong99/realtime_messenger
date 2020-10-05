export const transValidation = {
  incorrect_email: "unacceptable email",
  incorrect_gender: "are u gay?",
  incorrect_password: "your secret unmatches with our conditions",
  incorrect_password_confirmation: "what's wrong with your secret?"
};

export const transError = {
  account_in_use: "Email is existed!",
  account_removed: "account is removed. If there's something wrong, please contact to our customer support team",
  account_not_activated: "account is not activated yet, please contact to our customer support team"
}

export const transSuccess = {
  userCreated: (userEmail) => {
    return `The user <strong>${userEmail}</strong> was created, please try again.`;
  }
}