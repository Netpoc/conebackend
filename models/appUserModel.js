const mongoose = require('mongoose');
const { Schema } = mongoose;

const appUserSchema = new Schema({
    name: {
        type: String,
        required: true,        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    rc_number: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Reporter', 'Reviewer', 'Publisher','App_User'],
        default: 'App_User',        
    }
})

const appUser = mongoose.model('appUser', appUserSchema);
module.exports = appUser;