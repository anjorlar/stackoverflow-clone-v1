const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const API_VERSION = '/v1'

//connects to mongoDb
require('./db/mongoose')
const app = express()

//routes
const userRoute = require('./routes/user')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(API_VERSION, userRoute)
//call base end point
app.get('/', (req, res) => {
    res.status(200).send({
        'health-check': 'Ok',
        'message': 'base endpoint for stack over flow clone is up and running'
    })
})

module.exports = app