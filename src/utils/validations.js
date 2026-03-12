const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format");
  }
};

const validatePassword = (password) => {
  if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
    );
  }
};

const validateSignupData = (data) => {
  const { firstName, lastName, email, password } = data;

  if (!firstName) {
    throw new Error("First name is required");
  }
  if (!email) {
    throw new Error("Email is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (firstName.length < 3) {
    throw new Error("First name must be at least 3 characters long");
  }
  validateEmail(email);
  validatePassword(password);
};

module.exports = {
  validateEmail,
  validateSignupData,
};
