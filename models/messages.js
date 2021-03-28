const mongoose = require('mongoose') 
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({  // create schema
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

const Message = mongoose.model('Message', MessageSchema) // create model Message

module.exports = Message 
