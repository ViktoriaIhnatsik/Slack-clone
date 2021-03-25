const express = require('express')  // hämta express paket 
const router = express.Router() // sätta up router


// Login page
router.get('/', (request, response) => {
    response.render('welcome')  // använda welcome.ejs sida
})


module.exports = router //exportera den routen