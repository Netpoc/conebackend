const Tenant = require("../models/tenantModel");
const nodemailer = require("nodemailer");
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
      const user = await Tenant.findOne({rc_number});
      if (!user) {
        res
          .status(404)
          .json({ message: "Activation failed, Client not found." });
      } else {
        const email = user.email;
        const phone = user.phone;
        const name = user.name;
        //Generate App_User registration link
        const registrationLink = `https://conebox.vercel.app/register?email=${email}&rc_number=${rc_number}&name=${name}&phone=${phone}`;

        //Send registration link via email
        const mailOption = {
          from: process.env.EMAIL,
          to: email,
          subject: "Complete Your Registration",
          text: `Click this link to complete you registration: ${registrationLink}`,
        };

        transporter.sendMail(mailOption, (error, info) => {
          if (error) {
            console.log("Email sending failed", error);
          } else {
            res.status(200).send("Registration link sent successfully");
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
      }
      res.json({
        message: "User activated successfully.",
        user
      });

    } catch (err) {
      console.error(err);      
    }
  },
];