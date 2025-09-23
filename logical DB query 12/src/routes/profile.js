const express = require("express");
const profileRouter = express.Router();
const userauth = require("../middleware/auth");
const { ValidateEditUpdate } = require("../utils/helper");
const { User } = require("../models/user");

profileRouter.get("/profile/view", userauth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: "Error: " + err.message });
  }
});
profileRouter.patch("/edit", userauth, async (req, res) => {
  try {
    // ✅ Validate fields
    const { error } = ValidateEditUpdate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const loggedInUser = req.user; // from userauth middleware

    // ✅ Update allowed fields only
    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();

    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile was updated successfully`,
      user: loggedInUser,
    });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = profileRouter;


