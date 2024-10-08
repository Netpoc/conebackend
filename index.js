/*
Welcome to the entry point of Conebox Backend Application
*/

require("dotenv").config();
const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();

connectDB();
const authRoutes = require("./routes/auth");
const tenantAdminRoutes = require("./routes/tenantRoute");
const Client = require("./models/clientModel");

const { protect, auth } = require("./middleware/auth");


const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

//Registration Link
const generateRegistrationLink= (appUserEmail, rcNumber) => {
    const registrationLink = `http:localhost:7000/api/appuser?email=${appUserEmail}&rc_number=${rcNumber}`;
    return registrationLink;
}
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenant", tenantAdminRoutes);



app.post("/quick", async (req, res) => {
  const { username, name, password, email,secondary_email,phone,secondary_phone,
    role,
  } = req.body;

  //Check if all required data has been entered
  if (
    !(username && password && name && email && phone && role 
    )
  ) {
    res.status(400).send("All input is required");
  }  
  try {
    const appUserExist = await Client.findOne({email} );
    if (appUserExist) {
        res.status(400).json({ message: "A user with this info already exist." });
      } else {
        hashedPassword = await bcrypt.hash(password, 10);
        const user = new Client({
            username: username, 
            name: name,
            password: hashedPassword,            
            email: email,
            secondary_email:secondary_email,
            phone: phone,
            secondary_phone: secondary_phone,
            role: role, });
        await user.save();
        res.status(201).json(user);
      }
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Conebox Server is working");
});

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
