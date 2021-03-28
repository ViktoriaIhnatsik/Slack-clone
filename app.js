const express = require('express') // hämta express paket 
const app = express()   // sätta up app

const expressEjsLayout = require('express-ejs-layouts') // sätta up ejs
const flash = require('connect-flash') // sätta up flash
const session = require('express-session') //  sätta up session hanterare
const path = require('path')  // // sätta up path 
const passport = require('passport')

const http = require('http')  // sätts upp socket
const socketio = require('socket.io')
const User = require('./models/users')
const Room = require('./models/rooms')
const Message = require('./models/messages')  // model Message
const server = http.createServer(app)
const io = socketio(server)

const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

require('./config/passport')(passport)  // köra passport funkt

// Mongoose
const mongoose = require('mongoose') //sätta  up mongoose
mongoose.connect('mongodb://localhost:27017/slack_clone', {    
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// EJS
app.set('view engine', 'ejs')  // använda ejs som view engine, då behöver vi inte skriva ejs i router för varje sida, räker bara namn 
app.use(expressEjsLayout) // använda layout

app.use(express.urlencoded({ extended: true }))  // för att använda post 

app.use('/public', express.static(path.join(__dirname, 'public')));  // använda allt som ligger i public map

// Sessions
app.use(session({  
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session()) // kommer spara user data i session

// Flash
app.use(flash())  // request hantera flash meddelande
app.use((request, response, next) => { // skicka medel 
    response.locals.success_msg = request.flash('success_msg')
    response.locals.error_msg = request.flash('error_msg')
    response.locals.error = request.flash('error')
    next()
})


// Routes
app.use('/', require('./routes/index')) // använda index.js
app.use('/users', require('./routes/users')) // använda users.js
app.use('/chat', require('./routes/chat')) // använda chat.js



// Socket (chat server sida)
io.on('connection', (socket) => {  
  console.log('a user connected'); // när nån ansluten till server

   socket.on("joinRoom", ({ userName, roomId }) => {
		const user = userJoin(socket.id, userName, roomId);
		
    socket.join(user.room);

	})

 // Listen for chatMessage

  socket.on('chat message', message => {  // chat message from script.js
   const user = getCurrentUser(socket.id);
   let author = user.username                            
   io.to(user.room).emit('chat message',  formatMessage( author,  message ))  // sckica meddelande till alla i chat, alla se samma meddelande
    
    // Spara data i dbb
   User.findOne({ name: user.username}).exec(
     (error, currentUser) => {
       if(error) {
         throw error;
       }
       author = currentUser._id;
       const newMessage = new Message({ message, author})  // skapa new message i model Message
       newMessage.save()  

       Room.updateOne(
         {_id: user.room},
         { $push:{ messages: newMessage._id}},
         (error) => {
           if(error) {
             console.log(error);
           }
         }
       )
      }
   )
  })
 
  
    socket.on('disconnect', () => {
        console.log('a user disconnected')  // när användaren avslutet connection
      
   })
 })

server.listen(3004)

