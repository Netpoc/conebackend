const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require,        
    },
    email: {
        type: String,
        required: true,
    },
    role: {
        enum: ['Admin', 'User'],
        type: String,
        required: true,
        default: 'User'
    }
}) 

const AdminUser = mongoose.model('AdminUser', adminSchema);
module.exports = AdminUser;