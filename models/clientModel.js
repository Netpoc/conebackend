const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Client schema
const clientScema = new Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true },
    name: {
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true,

    },
    phone: {
        type: String,
        unique: true        
    },
    secodary_phone: {
        type: String,
        unique: true        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    alternate_email: {
        type: String
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

// Create the Client model
const clientModel = mongoose.model('Client', clientScema);

module.exports = clientModel;