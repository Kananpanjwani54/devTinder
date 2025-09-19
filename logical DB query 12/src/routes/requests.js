const express = require('express');
const userauth = require('../middleware/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
const { default: mongoose } = require('mongoose');
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userauth, async (req, res) => {
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
        const isToUserExist = await User.findById(toUserId);
        if (!isToUserExist) {
            return res.status(400).json({ error: "User not found" });
        }

        // Prevent sending request to self
        if (fromUserId.equals(toUserId)) {
            return res.status(400).json({ error: "You cannot send a request to yourself" });
        }

        const allowedStatus = ["interested", "ignore"];
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
            res.status(200).json({ message: "Connection request sent" });
        } else if (status === "ignore") {
            res.status(200).json({ message: "User ignored" });
        }

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

requestRouter.get("/request/send", userauth, async (req, res) => {
    try {
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        console.log("Sending a connection request");
        res.send(`${currentUser.firstName} sent a connection request`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = requestRouter;
