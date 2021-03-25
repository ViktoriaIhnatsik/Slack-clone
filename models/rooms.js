const mongoose = require('mongoose') // importera mongoose paket 
const Schema = mongoose.Schema;

const RoomSchema = new mongoose.Schema({  // skapa schema
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
/*
    messages: []
     */
})

const Room = mongoose.model('Room', RoomSchema) // skapa model room

module.exports = Room // exportera model Room
