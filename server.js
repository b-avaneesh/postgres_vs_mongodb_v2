const express = require('express')

require('dotenv').config()

/**
 * Configuring variables.
 */
const { PORT } = process.env;

const app = express();
app.use(express.json())

/**
 * Adding routes
 */
app.use('/', require("./routes"))
app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`)
})