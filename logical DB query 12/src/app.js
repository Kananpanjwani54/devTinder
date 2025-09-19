const express = require("express");
const { connectDB } = require("./config/database");
const bcrypt = require("bcrypt"); // Optional unless used here
const cookieParser = require('cookie-parser');


const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const requestConnections = require("./routes/requests");


// Use routes with appropriate prefixes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/requests", requestConnections);

// Connect to DB and start server
connectDB()
  .then(() => {
    console.log("DB connection established...");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
