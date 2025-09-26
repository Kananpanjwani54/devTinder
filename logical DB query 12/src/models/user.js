const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");   // use singular

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
      trim: true
    },
    age: {
      type: Number,
      min: 18,
      max: 60
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Others"],
        message: "{VALUE} is not supported"
      },
      required: true
    },
    gmail: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not correct: " + value);
        }
      }
    },
    about: {
      type: String,
      default: "This is by default!",
      trim: true
    },
  profilePic: {
  type: String,
  default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg",
  trim: true
}
,
    skills: {
      type: [String],
      default:[]
    }
  },
  { 
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema};
