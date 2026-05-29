const express = require('express')

const routes = express.Router();

routes.get('/testing', (req,res) =>{
    res.json({
        "msg" : "Testing successful"
    })
})


module.exports = routes;