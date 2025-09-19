const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // optional, if you have a User model
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // optional
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect type`,
      },
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
