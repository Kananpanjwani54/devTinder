//here api for users will be created where i can see pending request 
const express =require('express')
const userRouter=express.Router();

const userauth= require("../middleware/auth")
const ConnectionRequest=require("../models/connectionRequest")
const user_data=" firstName lastname gender skills about "

const usersafedata="firstName lastName photoUrl age gender skills"
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
// userRouter.get("/feed",userauth, async(req,res)=>{
//   //here User should see all card except :-
  
// })
module.exports=userRouter

