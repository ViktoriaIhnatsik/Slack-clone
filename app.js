const express = require('express') 
const app = express()   

const expressEjsLayout = require('express-ejs-layouts') 
const flash = require('connect-flash') 
const session = require('express-session') 
const path = require('path')  
const passport = require('passport')

const http = require('http')  
const socketio = require('socket.io')
const User = require('./models/users')
const Room = require('./models/rooms')
const Message = require('./models/messages')  
const server = http.createServer(app)
const io = socketio(server)

const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser} = require('./utils/users')

require('./config/passport')(passport)  

// Mongoose
const mongoose = require('mongoose') 
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
app.set('view engine', 'ejs')  
app.use(expressEjsLayout) 

app.use(express.urlencoded({ extended: true }))  // use post 

app.use('/public', express.static(path.join(__dirname, 'public')));  // use everything in the public map

// Sessions
app.use(session({  
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport
app.use(passport.initialize())
app.use(passport.session()) // will save user data in session

// Flash
app.use(flash())  // 
app.use((request, response, next) => { 
    response.locals.success_msg = request.flash('success_msg')
    response.locals.error_msg = request.flash('error_msg')
    response.locals.error = request.flash('error')
    next()
})


// Routes
app.use('/', require('./routes/index')) 
app.use('/users', require('./routes/users')) 
app.use('/chat', require('./routes/chat')) 



// Socket (chat server sida)
io.on('connection', (socket) => {  
  console.log('a user connected'); // when someone is connected to a server

   socket.on("joinRoom", ({ userName, roomId }) => {
		const user = userJoin(socket.id, userName, roomId);
		
    socket.join(user.room);

	})

 // Listen for chatMessage

  socket.on('chat message', message => {  // chat message from script.js
   const user = getCurrentUser(socket.id);
   let author = user.username                            
   io.to(user.room).emit('chat message',  formatMessage( author,  message ))  // send message to all ichat
    
    // Save data in db
   User.findOne({ name: user.username}).exec(
     (error, currentUser) => {
       if(error) {
         throw error;
       }
       author = currentUser._id;
       const newMessage = new Message({ message, author}) 
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
        console.log('a user disconnected')  // when user in not connected
      
   })
 })

server.listen(3004)

