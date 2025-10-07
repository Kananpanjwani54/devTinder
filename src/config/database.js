const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Log the connection string (without credentials in a real production environment for security)
    // For debugging, this is okay.
    console.log("Attempting to connect to MongoDB...");
    
    // Check if the connection string is loaded
    if (!process.env.DB_CONNECTION_SECRET) {
      throw new Error("DB_CONNECTION_SECRET is not defined in the .env file.");
    }

    await mongoose.connect(process.env.DB_CONNECTION_SECRET);

  } catch (error) {
    // Provide a more detailed error message
    console.error("MongoDB connection failed:", error.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
