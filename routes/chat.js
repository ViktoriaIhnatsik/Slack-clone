const express = require('express')  // hämta express paket 
const router = express.Router() // sätta up router

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { ensureAuthenticated } = require('../config/auth')

const Room = require('../models/rooms')  
const User = require('../models/users')  


// Dashboard   (visa alla rooms i sidebar)
router.get('/dashboard', ensureAuthenticated, (request, response) => {
   Room.find((err, data) => {   //data
   if (err) return console.error(err);
   response.render('dashboard', { rooms: data, user: request.user })  
  })
 })

 // Users api (visa alla users )
 router.get('/users', ensureAuthenticated, (request, response) => {
  User.find({}, (err, users) => {
    if (err) return handleError(err);
    response.status(200).json(users); 
  })
 })


 
// Skapa ny rooms
 router.post('/dashboard', ensureAuthenticated, (request, response) => {
      const room = new Room({   // skapa ny room 
      name: request.body.name
  });
  room.save((err) => {    // spara room i db
    if (err) return console.error(err);
    console.log('Channel created.');
    response.redirect('/chat/dashboard');
  });
});


//Öpna ett room
router.get('/dashboard/:id', ensureAuthenticated, (request, response) => {
  Room.findById(request.params.id, (err, room) => { 
    if (err) return console.error(err);
  response.render('room', { room, user: request.user });
  console.log(room)
  console.log(request.user)
  });
});


module.exports = router; //exportera den routen