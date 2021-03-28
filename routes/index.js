const express = require('express')  
const router = express.Router() 


// Login page
router.get('/', (request, response) => {
    response.render('welcome')  
})


module.exports = router 