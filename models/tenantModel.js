const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Client schema
const tenantSchema = new Schema({    
    name: {
        type: String,
        required: true
    },
    group: {
        type: Boolean,
        default: false,
        required: true        
    },
    phone: {
        required: true,
        type: String,        
    },
    secondary_phone: {
        type: String,        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    secondary_email: {
        type: String
    },
    rc_number: {
        type: String,
        required: true,
        unique: true,        
    },
    role: {
        type: String,
        enum: ['Tenant', 'App_User'],
        required: true,
        default: 'App_User'
    },
    password: {
        type: String,
        required: true
    }
});

// Create the Tenant model
const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;