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
app.post("/login", async (req, res) => {
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

// profile login 
app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      return res.status(401).send("Invalid token: token is missing.");
    }
    
    const decodemessage = await jwt.verify(token, SECRET_KEY);
    // The token's payload key is "userId", so we must use that here.
    const { userId } = decodemessage;

    // Now check if this user exists in the database
    const user = await User.findById(userId);
    
    console.log("logged in user is " + userId);
    
    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Send the user object as a JSON response
    res.json(user);

  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(401).send("Authentication failed: " + err.message);
  }
});

// accessing data usinf email
app.get("/user", async (req, res) => {
  try {
    // Corrected to use req.query for GET requests
    const firstName = req.query.firstName;
    const users = await User.find({ firstName: firstName });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(users);
    res.json(users); // send matching users
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

// all users get
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(users);
    res.json(users); // send matching users
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user");
  }
});

// delete user by id
app.delete("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// update user by id
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["skills", "profilePic", "about", "gender", "firstName"];
    console.log("Yaha h");

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Update not allowed");
    }

    if (data?.skills && data.skills.length > 10) {
      return res.status(400).send("Skills can't be more than 10");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      data,
      { new: true, runValidators: true }
    );

    console.log("Yaha h 2");

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    console.log("Yaha h 3");
    res.json({ message: "User Updated", user: updatedUser });
  } catch (err) {
    res.status(400).send("WRONG: " + err.message);
  }
});

// Add validations to inserting data 
// hw -->skills

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
