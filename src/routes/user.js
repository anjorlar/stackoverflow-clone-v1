const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

router.post('/register', userController.userSignUp)

module.exports = router