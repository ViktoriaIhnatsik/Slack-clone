const express = require('express')  // hämta express paket 
const router = express.Router() // sätta up router
const moment = require('moment'); // for time

const multer = require('multer');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { ensureAuthenticated } = require('../config/auth')

const Room = require('../models/rooms')  
const User = require('../models/users')  
const Message = require('../models/messages') 

// for files  upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, 'public/uploads/')
  },
  filename: (req, file, callback) => {
      callback(null, file.originalname)
  }
});
const upload = multer({ storage: storage });


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

 // File upload
router.post('/upload', upload.single('uploadFile'), (request, response) => {
  console.log(request.file, response.body);
  response.sendStatus(200);
  response.end();
});


 
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
  Room.findById(request.params.id)
  .populate({path: 'messages', populate: { path: 'author', select: 'name'}})
  .exec((err, room) => { 
    //console.log(room)
    //console.log(request.user)
    response.render('room', { room, user: request.user, moment: moment });
});
});


module.exports = router; //exportera den routen