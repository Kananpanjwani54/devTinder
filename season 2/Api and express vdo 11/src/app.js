const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user"); // fixed import
const { isValidObjectId } = require("mongoose");
const bcrypt = require('bcrypt');
const { validateSignUp } = require("./utils/helper");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
// for cookie parsing middleware
app.use(cookieParser());

const SECRET_KEY = "KAnan@#$"; // Moved up to be accessible by all routes

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, gmail, password, age, gender } = req.body;

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
    console.log(password);

    const savedUser = await user.save();
    res.status(201).send("User Added Successfully");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error posting data: " + err.message);
  }
});

// login api creation 
app.post("/login", userauth, async (req, res) => {
  try {
    const { gmail, password } = req.body;
    // using gmail we r checking whther th mail exist in db or not
    const user = await User.findOne({ gmail: gmail });
    if (!user) {
      return res.status(400).send("Invalid Credentials!");
    }
    const isPasswordvalid = await bcrypt.compare(password, user.password);
    if (isPasswordvalid) {
      // generate jwt token
      const token = jwt.sign(
        { userId: user._id },
        SECRET_KEY,
        { expiresIn: "24hr" }
      );

      // Add token to cookie and send the cookie to user with jwt 
      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      res.status(400).send("Invalid Credentials!");
    }
  } catch (err) {
    console.error(err);
    res.status(400).send("Error posting data: " + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("Db connection established...");
    app.listen(3000, () => {
      console.log("Server Connected on port 3000");
    });
  })
  .catch((err) => {
    console.log("Hemlo error hain!", err);
  });
