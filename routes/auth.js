const express = require('express');
const router = express.Router();
const User = require('../models/tenantModel');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        console.log({ message: 'Server error' }, err);
    }
});

module.exports = router;