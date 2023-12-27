// routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware
const authenticateToken = (req, res, next) => {
  // Your authentication logic here (e.g., verify JWT)
  // For simplicity, you can use a middleware like 'jsonwebtoken' to verify the token.
  // Ensure to handle errors and unauthorized access appropriately.
  next();
};

// Registration route
// Registration route
router.post("/register", async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // User already exists, send an error response
      return res.status(400).json({ error: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();
    // Registration successful
    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    // Handle the error and send an appropriate response
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    return res.json({ user: { id: user._id }, token });
  } catch (error) {
    // console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/user/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const userDetails = await User.findOne({ _id: user });

    if (!userDetails) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(201).json({ userDetails });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updatepassword/", async (req, res) => {
  const { user, currentPassword, newPassword } = req.body;
  try {
    const userAcc = await User.findById(user);
    if (!userAcc) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      userAcc.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    userAcc.password = hashedNewPassword;
    await userAcc.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/Updateprofile", async (req, res) => {
  const { updateUserData } = req.body;
  try {
    let userAcc = await User.findById(updateUserData._id);
    if (!userAcc) {
      return res.status(404).json({ error: "User not found" });
    }

    userAcc.firstName = updateUserData.firstName;
    userAcc.lastName = updateUserData.lastName;
    userAcc.phoneNumber = updateUserData.phoneNumber;

    await userAcc.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Protected route
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route" });
});

module.exports = router;
