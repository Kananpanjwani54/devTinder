
const validator = require("validator");
const jwt = require("jsonwebtoken");
//you need to verify the token and then u can do else things

require("dotenv").config();

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

const isTokenValid = async (token) => {
  const decodedMessage = jwt.verify(token,process.env.JWT_SECRET);
  return decodedMessage;
};

const ValidateEditUpdate = (data) => {
  const allowedUpdates = ["firstName", "lastName", "gmail", "age", "gender", "skills", "profilePic","about"];
  const updates = Object.keys(data);

  const isValid = updates.every((field) => allowedUpdates.includes(field));

  if (!isValid) {
    return { error: new Error("Invalid fields in update request!") };
  }

  return { error: null };
};

module.exports = {
  validateSignUp,
  ValidateEditUpdate
};
