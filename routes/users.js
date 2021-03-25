const express = require('express')  // hämta express paket 
const router = express.Router()  // sätta up router

const User = require('../models/users')  // User from models 
const bcrypt = require('bcrypt')  
const passport = require('passport')


// Login
router.get('/login', (request, response) => {
    response.render('login')   // använda login.ejs sida
})
// Register
router.get('/register', (request, response) => {
    response.render('register')   // använda register.ejs
})

// Login
router.post('/login', (request, response, next) => {
    passport.authenticate('local', {  //authenticate -> inbygda funkt passport
        successRedirect: '/chat/dashboard', // vad ska hända om saker går bra eller inte
        failureRedirect: '/users/login', // var användaren ska skickas 
        failureFlash: true
    })(request, response, next) // skicka vidare request
})

// Register
router.post('/register', (request, response) => {
    const { name, email, password } = request.body  // from registern.ejs {name: ..., email: ..., password: ...}

    let errors = []  // pusha nya fält om det uppstår olika error

    if (!name || !email || !password) { // om fälten toma
        errors.push({ msg: "Please fill out all fields" })
    }

    if (password.length < 6) { // kolla password
        errors.push({ msg: "Use at least 6 characters for your password" })
    }

    if (errors.length > 0) { // om det finns nåt error
        response.render('register', { // rendera register sida igen
            errors, name, email, password // man kan göra ändringar där finns fel
        })
    } 
    else {
        const newUser = new User({ // om det finns inte error 
            name, email, password // skapa new User
        })

        // kryptera lösenord
        bcrypt.hash(password, 10, function (error, hash) {  // bcrypt -> paket som kripterar lösenord
            // Store hash in your password DB
            newUser.password = hash  // hash -> krypterad lösenord

            newUser   // spara new User i database 
                .save()
                .then(value => {
                    request.flash('success_msg', 'You have been registered!')
                    response.redirect('/users/login')  // skicka tillbacka till inloggnings sida
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