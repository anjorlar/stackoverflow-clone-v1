const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

router.post('/register', userController.userSignUp)
router.post('/login', userController.userLogin)
router.post('/logout', auth, userController.userLogout)
router.post('/follow/question', auth, userController.followQuestion)
router.get('/user/search', auth, userController.searchUser)
module.exports = router