const express = require('express')  
const router = express.Router()  

const User = require('../models/users')   
const bcrypt = require('bcrypt')  
const passport = require('passport')


// Login
router.get('/login', (request, response) => {
    response.render('login')   
})
// Register
router.get('/register', (request, response) => {
    response.render('register')   
})

// Login
router.post('/login', (request, response, next) => {
    passport.authenticate('local', {  //authenticate -> built in passport
        successRedirect: '/chat/dashboard', // if success -> send user to dashboard
        failureRedirect: '/users/login', // if fail -> send user to login
        failureFlash: true
    })(request, response, next) 
})

// Register
router.post('/register', (request, response) => {
    const { name, email, password } = request.body  // from registern.ejs {name: ..., email: ..., password: ...}

    let errors = []  // // push new fields if different errors occur

    if (!name || !email || !password) { // if field is empty
        errors.push({ msg: "Please fill out all fields" })
    }

    if (password.length < 6) { // check password
        errors.push({ msg: "Use at least 6 characters for your password" })
    }

    if (errors.length > 0) { // if there is an error
        response.render('register', { // render register page again
            errors, name, email, password // user can make changes where exist errors
        })
    } 
    else {
        const newUser = new User({ //if there is no error
            name, email, password // create new User
        })

        // encrypt passwords
        bcrypt.hash(password, 10, function (error, hash) {  // bcrypt -> package that encrypts passwords
            // Store hash in your password DB
            newUser.password = hash  // hash -> encrypted password

            newUser   // save new User in database
                .save()
                .then(value => {
                    request.flash('success_msg', 'You have been registered!')
                    response.redirect('/users/login')  // send back to login page
                })
                .catch(error => console.log(error))
        });

    }

})

// Logout
router.get('/logout', (request, response) => {
    request.logout()
    request.flash('success_msg', 'You have logged out')
    response.redirect('/users/login')
})

module.exports = router