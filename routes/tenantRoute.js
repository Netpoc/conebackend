const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Tenant = require("../models/tenantModel");
const App_User = require("../models/appUserModel");
const { protect, authorize } = require("../middleware/auth");

exports.create = [
  protect,
  authorize("Client_Admin"),
  async (req, res) => {
    const {
      name,
      password,
      rc_number,
      email,
      secondary_email,
      phone,
      secondary_phone,
      role,
    } = req.body;

    //Check if all required data has been entered
    if (
      !(
        username &&
        password &&
        name &&
        email &&
        secondary_email &&
        phone &&
        secondary_phone &&
        role &&
        rc_number
      )
    ) {
      res.status(400).send("All input is required");
    }
    if (role !== "App_User") {
      return res
        .status(403)
        .json({ message: "Client_Admin can only create App_Users" });
    }
    try {
      const appUserExist = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (appUserExist) {
        res
          .status(400)
          .json({ message: "A user with this info already exist." });
      } else {
        hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
          username: username,
          email: email,
          password: hashedPassword,
          role: role,
          company: company,
        });
        await user.save();
        res.status(201).json(user);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  },
];

exports.delete = [
  protect,
  authorize("Client_Admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (user.role !== "App_User") {
        return res
          .status(403)
          .json({ message: "Client_Admin can only delete App_Users" });
      }
      await user.remove();
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

exports.update = [
  protect,
  authorize("Client_Admin"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

//Tenant Profile update with password
exports.updateProfile = [
  async (req, res) => {
    const {password, group, percent, parent, rc_number} = req.body;
    if (!(password && group && rc_number)) {
      res.status(400).json({message: "All fields are required"});
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const update = await Tenant.updateOne({rc_number: rc_number}, 
        { $set: {
          password: hashedPassword,
          group: group,
          percent: percent,
          parent: parent
      }});
      res.status(200).json(update);
    } catch(err){
      console.error(err)
      res.status(500).json({message: "Server error"});
    }
  }
]

exports.register = [
  async (req, res) => {
    const { email, rc_number, address, group, phone, name } = req.body; // Get data from Vue.js form

    try {
      // Validate the RC_Number
      const tenant = await Tenant.findOne({ rc_number });
      if (!tenant) {
        return res
          .status(400)
          .json({ message: "Invalid or expired registration link" });
      }

      // Ensure user isn't already registered
      const existingUser = await App_User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already registered" });
      }
      
      // Register new App_User under the Tenant's RC_Number
      const newUser = new App_User({
        email,
        name,
        phone,
        address,
        group,
        rc_number,
        
      });
      await newUser.save();
      res
        .status(201)
        .json({ message: "Registration successful", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Registration failed", error });
      console.log(error);
    }
  },
];

//Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//App-User Registration Link
exports.sendlink = [ async (req, res) => {
  const { email, rc_number } = req.body;
  try {
    const tenant = await Tenant.findOne({ rc_number });
    if (!tenant) {
      return res.status(400).json({ message: "Invalid RC Number" });
    }
    const app_user = await App_User.findOne({ email });
    if (app_user) {
      return res.status(400).json({ message: "App User Already Exsist" });
    }
    //Generate App_User registration link
    const registrationLink = `https://conebox.vercel.app/tenant_complete_registration?email=${email}&rc_number=${rc_number}`;

    //Send registration link via email
    const mailOption = {
      from: process.env.EMAIL,
      to: email,
      subject: "Complete Your Registration",
      text: `Click this link to complete you registration: ${registrationLink}`,
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) return res.status(500).send(error);
      res.status(200).send("Registration link sent successfully");
    });
  } catch (err) {
    res.status(500).send("Error generating link");
    console.error(err);
  }
}]