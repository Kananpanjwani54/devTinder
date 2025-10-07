const express = require('express');
const userauth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { User } = require("../models/user");
const { default: mongoose } = require('mongoose');

const requestRouter = express.Router();

// const sendEmail=require("../utils/sendEmail")


// ------------------ SEND REQUEST ------------------
requestRouter.post("/send/:status/:toUserId", userauth, async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(400).json({ error: "Unauthorized. Please login again." });
    }

    const fromUserId = currentUser._id;
    const { status, toUserId } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    // Check if toUser exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(400).json({ error: "User not found" });
    }

    // Prevent sending request to self
    if (fromUserId.equals(toUserId)) {
      return res.status(400).json({ error: "You cannot send a request to yourself" });
    }

    // Allowed status values
    const allowedStatus = ["ignore", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: `Invalid status type '${status}'` });
    }

    // Check for existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ error: "Connection request already exists" });
    }

    // Create new connection request
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();

  if (status === "interested") {
    // const emailRes = await sendEmail.run(); 
    // console.log("Email sent:", emailRes);

    return res.status(200).json({
      message: `${currentUser.firstName} is interested in ${toUser.firstName}`,
    });
  }

  return res.status(200).json({ message: "User ignored" });
} catch (err) {
  console.error("Error sending email:", err);
  return res.status(500).json({ error: err.message });
}
});

// ------------------ REVIEW REQUEST ------------------
requestRouter.post("/review/:status/:requestId", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ error: "Unauthorized. Please login again." });
    }

    const { status, requestId } = req.params;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: `Invalid status type '${status}'` });
    }

    // Now, check conditions
    const request = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    });

    if (!request) {
      return res.status(400).json({ error: "Connection request does not exist or is not pending." });
    }
    

    request.status = status;
    await request.save();

    res.status(200).json({ message: `Connection request ${status}`});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ------------------------------------





module.exports = requestRouter;

