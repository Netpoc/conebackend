const express = require("express");
const router = express.Router();
const Admin = require("../models/adminModel");
const Tenant = require("../models/tenantModel");
const AppUser = require("../models/appUserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Try to find the user in the User model first
  let user = await Admin.findOne({ email });
  if (user) {
    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      // Login successful
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "User login successful", user, token });
    }
  }
  // If user not found in User model, check in Client model
  let client = await Tenant.findOne({ email });
  if (client) {
    const isMatch = await bcrypt.compare(password, client.password);
    if (isMatch) {
      // Login successful for client
      const token = jwt.sign(
        { id: client._id, role: client.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Client login successful", user: client, token });
    }
  }
  // If user not found in User model, check in Client model
  let appuser = await AppUser.findOne({ email });
  if (appuser) {
    const isMatch = await bcrypt.compare(password, appuser.password);
    if (isMatch) {
      // Login successful for client
      const token = jwt.sign(
        { id: appuser._id, role: appuser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Client login successful", user: appuser, token });
    }
  }
  // If neither User nor Client was found
  
  return res.status(401).json({ message: "Invalid username or password" });
});

module.exports = router;
