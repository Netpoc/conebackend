const express = require('express');
const router = express.Router();
const Tenant = require('../models/tenantModel');
const Client = require('../models/clientModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");


function generateAccessToken(user) {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '3h' });
  }

router.post('/login', async (req, res) => {
    const { username,email, password } = req.body;
    try {
       let user = await Client.findOne({$or: [{ username: username }, { email: email }]})

       if(!user) {
        user = await Tenant.findOne({$or :[{username: username}, {email: email}]})
        if(!user) {
            return res.status(404).json({message: 'User does not exsist'})
        }
       }
       const validPassword = await bcrypt.compare(password, user.password);
       if(!validPassword){
        return res.status(401).json({message: 'Invalid password!'});
       }

       const role = user instanceof Tenant ? 'Tenant' : 'Client';
       const accesssToken = generateAccessToken({_id: user._id, role});

       res.status(200).json({accesssToken, user, message: `${role} logged in successfully`})
    } catch (err) {
        console.log({ message: 'Server error' }, err);
        // Catch any database or server errors
    res.status(500).json({ message: 'An error occurred during login', error: err.message });
    }
});

module.exports = router;