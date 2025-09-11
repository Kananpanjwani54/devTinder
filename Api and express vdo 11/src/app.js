const express = require("express");
const { connectDB } = require("./config/database");
const { User } = require("./models/user"); // fixed import
const { isValidObjectId } = require("mongoose");
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
// for cookie parsing middleware

//importing routes to connect everything 
const profileRoutes=require("./routes/profile")
const authRoutes=require("./routes/auth")
const requestconnections = require('./routes/request');

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
