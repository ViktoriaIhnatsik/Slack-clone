const LocalStrategy = require('passport-local').Strategy // skapa strategy, sätt att inloga i passport kallas strategy
const bcrypt = require('bcrypt')
const User = require('../models/users')  // läsa model User

module.exports =  function(passport) {  // exportera för att använda det
    passport.use(new LocalStrategy( // sätta upp
        {  // konfigurations parametr
            usernameField: 'email'
        },
        function (username, password, done) {
            User.findOne({ email: username}, function (error, user) {
                if (error) {  // om error innehåller nåt
                    return done(error)
                }

                if (!user) {  // if not user
                    return done(null, false, { message: 'Incorrect username.' })
                }

                // jämföra det som vi har i database och det som användare har skrivit
                bcrypt.compare(password, user.password, (error, isMatch) => { // password ->  användare har skrivit i input
                                                                            // user.password -> det som finns i database, det är krypterad
                    if (error) { // kolla om det finns fel       
                        throw error
                    }

                    if (isMatch) { // om det matchar
                        return done(null, user)  // retunera user obj
                    } 
                    else { // om det inte matchar
                        return done(null, false, { message: 'Incorrect password.' })
                    }
                })
            })
                .catch(error => console.log(error))
        }
    ))


    // behöver föt att använda user objekt
    passport.serializeUser((user, done) => { // funct för att spara user objekt i session
        done(null, user.id) // user.id -> används som nyckel
    })

    passport.deserializeUser((id, done) => {  
        User.findById(id, (error, user) => { // letar user by id, id -> som vi skickar in
            done(error, user)
        })
    })
}