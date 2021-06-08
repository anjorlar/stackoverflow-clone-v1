const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const sendAnswerMailer = require('./libs/rabbitmq')
const API_VERSION = '/v1'
const QUEUE_NAME = 'SUBSCRIBE'

//connects to mongoDb
require('./db/mongoose')
//runs scheduler to sendmail
require('./jobs/mailer');


const app = express()

//routes
const userRoute = require('./routes/user')
const questionRoute = require('./routes/question');
const answerRoute = require('./routes/answer')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.use(API_VERSION, userRoute)
app.use(API_VERSION, questionRoute)
app.use(API_VERSION, answerRoute)

// initialises the send mailer function
sendAnswerMailer.receiveQueue(QUEUE_NAME)
//call base end point
app.get('/', (req, res) => {
    res.status(200).send({
        'health-check': 'Ok',
        'message': 'base endpoint for stack over flow clone is up and running'
    })
})

module.exports = app