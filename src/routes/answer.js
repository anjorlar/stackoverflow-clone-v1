const express = require('express')
const router = express.Router()
const answerController = require('../controllers/answer');
const auth = require('../middlewares/auth')

router.post('/answer/add', auth, answerController.addAnswers)
router.get('/answer/search', auth, answerController.searchAnswers)

module.exports = router