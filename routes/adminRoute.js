const Tenant = require("../models/tenantModel");
const Admin = require("../models/adminModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
//const { protect, authorize } = require("../middleware/auth");

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

//List All Clients
exports.tenants = [
  async (req, res) => {
    console.log("working link");
    try {
      const tenants = await Tenant.find();
      res.json(tenants);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error fetching Tenants" });
    }
  },
];

//Activate Tenant
exports.activate = [
  async (req, res) => {
    const rc_number = req.query.rc_number;
    try {
      const user = await Tenant.findOne({ rc_number });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Activation failed, Client not found." });
      }
      //Generate App_User registration link
      const email = user.email;
      const phone = user.phone;
      const registrationLink = `https://conebox.vercel.app/register?email=${email}&rc_number=${rc_number}&phone=${phone}`;

      //Send registration link via email
      const mailOption = {
        from: process.env.EMAIL,
        to: email,
        subject: "Complete Your Registration",
        text: `Click this link to complete you registration: ${registrationLink}`,
      };

      transporter.sendMail(mailOption, (error, info) => {
        if (!error) {
          return res
            .status(400)
            .json({ message: "Activation email sent successfully" });
        }
      });

      const activate = await Tenant.findOneAndUpdate(
        { rc_number: rc_number },
        { activated: true },
        { new: true }
      );

      if (!activate) {
        res
          .status(404)
          .json({ message: "Activation failed, Client not found." });
      }

      res.json({
        message: "User activated successfully.",
      });
    } catch (err) {
      console.error(err);
    }
  },
];

exports.addadmin = [
  async (req, res) => {
    const { email, name, password, role } = req.body;

    if (!(email && name && password && role)) {
      res.status(400).json({ message: "All inputs are required" });
    }
    try {
      const admin = await Admin.findOne({ email });
      if (admin) {
        res.status(400).json({ message: "A user already exist" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({
          name: name,
          password: hashedPassword,
          role: 'Admin',
          email: email
        })
        await admin.save();
        res.status(201).json(admin)
      }
    } catch (err) {
      res.status(500).json({message: "Server error"});
      console.error(err);
    }
  },
];
