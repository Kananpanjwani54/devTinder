const express=require("express")

const profileRoutes=express.Router();
const userauth= require("../middleware/auth");
const { ValidateEditUpdate } = require("../utils/helper");
profileRoutes.get("/profile/view", userauth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    // FIXED: Consistent JSON error response
    res.status(400).send({ error: "Error: " + err.message });
  }
});
profileRoutes.patch("/profile/edit", userauth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Update not allow");
    }

    const loggedInUser = req.user;
    console.log("hi")
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    await loggedInUser.save();
    // Save with validation
    await loggedInUser.save();

    console.log("After update:", loggedInUser);

    res.send(`${loggedInUser.firstName}, your profile was updated successfully`);
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(400).send({ error: err.message });
  }
});

module.exports = profileRoutes;