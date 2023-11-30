// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountStatus: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  profilePicture: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
