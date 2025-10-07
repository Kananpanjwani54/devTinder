const express = require("express")
const bcrypt = require('bcrypt')
const authRoutes = express.Router();

const { validateSignUp } = require("../utils/helper");
const jwt = require('jsonwebtoken');
const {User} = require("../models/user");   // ✅ FIX: Added User model import

const SECRET_KEY="KAnan@#$"

authRoutes.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, gmail, password, age, gender} = req.body;

    // Validate data
    validateSignUp(req);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      gmail,
      password: passwordHash,
      age,
      gender
    });

    const savedUser = await user.save();
    
    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    console.error(err);
    res.status(400).send("Error posting data: " + err.message);
  }
});

// login api creation 
authRoutes.post("/login", async (req, res) => {   // ✅ FIX: removed userauth middleware here
  try {
    const { gmail, password } = req.body;

    // using gmail we r checking whether the mail exist in db or not
    const user = await User.findOne({ gmail: gmail });
    if (!user) {
      return res.status(400).send("Invalid Credentials!");
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (isPasswordvalid) {
      // generate jwt token
      const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY
      );

      // Add token to cookie and send the cookie to user with jwt 
      res.cookie("token", token);
      res.send(user);
    } else {
      res.status(400).send("Invalid Credentials!");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Error posting data: " + err.message);
  }
});
//logout api
authRoutes.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful!" });
});

module.exports = authRoutes;
