//here api for users will be created where i can see pending request 
const express =require('express')
const userRouter=express.Router();
const { User } = require("../models/user");
const userauth= require("../middleware/auth")
const ConnectionRequest=require("../models/connectionRequest")


const usersafedata="firstName lastName about age gender skills profilePic"
//get all connection request received
userRouter.get("/request/received", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId",user_data)
      .populate("toUserId",user_data)
    res.json({
      message: "Data fetched successfully",
      data: connectionRequests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//accepted connections that is freinds
userRouter.get("/connections", userauth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const userFields = "firstName lastName age gender skills status about profilePicture"; // Define fields to populate

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ],
        })
        .populate("fromUserId", userFields)
        .populate("toUserId", userFields);

        const connections = connectionRequests.map((row) => {
            // Use .equals() for reliable ObjectID comparison
            if (row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId; // If I sent it, return the receiver
            }
            return row.fromUserId; // If I received it, return the sender
        });

        res.status(200).json({ connections });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

userRouter.get("/feed", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;

  //bec somone can input negative vale 
const page = Math.max(1, parseInt(req.query.page) || 1);
let limit = Math.min(50, parseInt(req.query.limit) || 10);
 
limit=limit>50?50:limit;
const skip=(page-1)*limit;


    // Find all connection requests (sent + received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    // Hide users (unique IDs using Set)
    const hideUsersFromFeed = new Set();
    hideUsersFromFeed.add(loggedInUser._id.toString());

    connectionRequest.forEach(reqItem => {
      hideUsersFromFeed.add(reqItem.fromUserId.toString());
      hideUsersFromFeed.add(reqItem.toUserId.toString());
    });

    // console.log(hideUsersFromFeed);

    // Get users not in hideUsersFromFeed
    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) }
    }).select(usersafedata)
    .skip(skip)
    .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    console.error("Feed error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = userRouter;


