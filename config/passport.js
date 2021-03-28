const LocalStrategy = require('passport-local').Strategy // create strategy, way to log in passport
const bcrypt = require('bcrypt')
const User = require('../models/users')  

// Set up strategy
module.exports =  function(passport) {  
    passport.use(new LocalStrategy( 
        {  
            usernameField: 'email'
        },
        function (username, password, done) {
            User.findOne({ email: username}, function (error, user) {
                if (error) {  
                    return done(error)
                }

                if (!user) {  
                    return done(null, false, { message: 'Incorrect username.' })
                }

                // compare info in db and what users have written
                bcrypt.compare(password, user.password, (error, isMatch) => { // password ->  user wrotw in input
                                                                            // user.password -> what we have in db, it's encrypted
                    if (error) {      
                        throw error
                    }

                    if (isMatch) { // if it matches
                        return done(null, user)  // return user obj
                    } 
                    else { // if it's not matches
                        return done(null, false, { message: 'Incorrect password.' })
                    }
                })
            })
                .catch(error => console.log(error))
        }
    ))


    
    passport.serializeUser((user, done) => { // funct to save user objects in session
        done(null, user.id) // user.id -> used as a key
    })

    passport.deserializeUser((id, done) => {  
        User.findById(id, (error, user) => { // looking for user by id, id -> which we send in
            done(error, user)
        })
    })
}