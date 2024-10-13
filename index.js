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

const Tenant = require("./models/tenantModel");

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const adminController = require("./controllers/adminController");
const tenantController = require("./controllers/tenantController");


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tenant", tenantController);
app.use("/api/admin", adminController);

app.get("/tenants", async (req, res) => {
  try{
    const tenants = await Tenant.find();
    res.status(200).send(tenants)    
  } catch(err){
    console.error(err)
  }

});

app.get("/tenant", async(req, res)=> {
  const rc_number = req.query.rc_number;
  try{    
    const tenant = await Tenant.findOne({rc_number})
    if(!tenant){
      return res.status(401).json({message: 'User not found.'})      
    }
    res.json(tenant);
  } catch(err){
    console.log(err)
  }
})

app.get("/", (req, res) => {
  res.status(200).send("Conebox Server is working");
});

app.listen(port, () => {
  console.log(`Server is running on Port: ${port}`);
});
