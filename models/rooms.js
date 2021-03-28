const mongoose = require('mongoose') 
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({  // create schema
    name: {
        type: String,
        required: true,
        maxLength: 100
    },

    messages: [{
        type: Schema.Types.ObjectId,
		ref: 'Message'
    }]
     
})

const Room = mongoose.model('Room', RoomSchema) // create model room

module.exports = Room 
