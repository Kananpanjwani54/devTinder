require('dotenv').config();
const express = require("express");
const { connectDB } = require("./config/database");
const bcrypt = require("bcrypt"); // Optional unless used here
const cookieParser = require('cookie-parser');
const cors=require('cors')
const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());
//used to get cookies in application 

const corsOptions = {
  origin: [
    "http://localhost:5173",          // Your local frontend URL
    "https://thedevconnect.co.in"     // Your production frontend URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS middleware (also handles preflight requests)
app.use(cors(corsOptions));


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// Routes
const profileRouter = require("./routes/profile");
const authRoutes = require("./routes/auth");
const requestConnections = require("./routes/requests");
const userRouter = require("./routes/user");


// Use routes with appropriate prefixes
app.use("/auth", authRoutes);
app.use("/profile", profileRouter);
app.use("/requests", requestConnections);
app.use("/user", userRouter);


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
