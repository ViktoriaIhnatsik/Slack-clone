const mongoose = require('mongoose') 
const UserSchema = new mongoose.Schema({  // create schema
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

})

const User = mongoose.model('User', UserSchema) // create model user

module.exports = User 
