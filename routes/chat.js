const express = require('express')   
const router = express.Router() 
const moment = require('moment'); 

const multer = require('multer');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const { ensureAuthenticated } = require('../config/auth')

const Room = require('../models/rooms')  
const User = require('../models/users')  


// for file  upload
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
      callback(null, 'public/uploads/')
  },
  filename: (req, file, callback) => {
      callback(null, file.originalname)
  }
});
const upload = multer({ storage: storage });


// Dashboard show all rooms in sidebar
router.get('/dashboard', ensureAuthenticated, (request, response) => {
   Room.find((err, data) => {   
   if (err) return console.error(err);
   response.render('dashboard', { rooms: data, user: request.user })  
  })
 })

 // Users api (show all users)
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


 
// Create new rooms
 router.post('/dashboard', ensureAuthenticated, (request, response) => {
      const room = new Room({   // create new room
      name: request.body.name
  });
  room.save((err) => {   // save room in db
    if (err) return console.error(err);
    console.log('Channel created.');
    response.redirect('/chat/dashboard');
  });
});


// Open one room
router.get('/dashboard/:id', ensureAuthenticated, (request, response) => {
  Room.findById(request.params.id)
  .populate({path: 'messages', populate: { path: 'author', select: 'name'}})
  .exec((err, room) => { 
    //console.log(room)
    //console.log(request.user)
    response.render('room', { room, user: request.user, moment: moment });
});
});


module.exports = router; 