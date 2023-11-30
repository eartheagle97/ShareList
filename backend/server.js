// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI);

// Event handlers for MongoDB connection
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Error connecting to MongoDB:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
