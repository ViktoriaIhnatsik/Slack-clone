const mongoose = require('mongoose') // importera mongoose paket 
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({  // skapa schema
     message: {
        type: String,
        required: true
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        
    },

    date: {
	  type: Date,
      default: new Date(),
      required: true		
		} 
})

const Message = mongoose.model('Message', MessageSchema) // skapa model room

module.exports = Message // exportera model Room
