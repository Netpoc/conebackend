const Tenant = require("../models/tenantModel");
const Admin = require("../models/adminModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { adminprotect, authorize } = require("../middleware/auth");

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
exports.tenants = [ adminprotect, authorize("Admin"),
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
exports.activate = [ authorize("Admin"), adminprotect,
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
  adminprotect,
  authorize("Admin"),
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

exports.addclient = [async (req, res) => {
  const {name, rc_number, address, phone, email, group, secondary_email, secondary_phone} = req.body;

  if(!(name && rc_number && phone && email && address)) {
    return res.status(401).json({message: "All fields are required."})
  }
  try {
    const clientExist = await Tenant.findOne({rc_number});
    if (clientExist) {
      return res.status(400).json({message: "A company already exist with this data"});
    } else {
      const client = new Tenant({
        name: name,
        address: address,
        rc_number: rc_number,
        email: email,
        phone: phone,
        secondary_email: secondary_email,
        secondary_phone: secondary_phone,
        group: group,
        role: "Tenant"
      })
      await client.save();
      res.status(201).json({message: "Client added successfully"})
    }
  } catch (err) {
    res.status(500).json({message: "Server error"});
    console.error(err)
  }

}]