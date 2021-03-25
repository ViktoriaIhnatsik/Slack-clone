module.exports = {  // för att gå till dashboard bara när användaren är inloggad
    ensureAuthenticated: (request, response, next) => {
        if (request.isAuthenticated()) { // inbygd funkt
            return next()
        } else {
            request.flash('error_msg', 'Please login to view this resource')
            response.redirect('/users/login')
        }
    }
}