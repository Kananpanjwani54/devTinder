const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, gmail, password, age, gender } = req.body;

  // Check for ALL required fields and provide a clear, accurate error message.
  if (!firstName || !lastName || !gmail || !password || !age || !gender) {
    throw new Error("Missing required fields: firstName, lastName, gmail, password, age, or gender.");
  }

  // Use separate 'if' statements for better readability and to ensure
  // all checks are executed independently after the initial presence check.
  if (!validator.isEmail(gmail)) {
    throw new Error("Email is not valid.");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password.");
  }
};

module.exports = {
  validateSignUp,
};