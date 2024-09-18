const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Client schema
const appUserSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,        
    },
    secodary_phone: {
        type: String,        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    alternate_email: {
        type: String
    },
    client_id: {
        type: String,
        required: true,        
    },
    
    role: {
        type: String,
        enum: ['Admin', 'Tenant', 'App_User'],
        required: true,
        default: 'App_User'
    },
    password: {
        type: String,
        required: true
    }
});

// Create the Client model
const appUser = mongoose.model('Client', appUserSchema);

module.exports = appUser;