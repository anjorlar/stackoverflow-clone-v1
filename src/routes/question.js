const express = require('express');
const router = express.Router()
const questionController = require('../controllers/question');
const auth = require('../middlewares/auth')
router.post('/question/add', auth, questionController.createQuestion)
router.get('/question/view/:id', questionController.viewQuestion)
router.put('/question/update/:id', auth, questionController.updateQuestion)
router.patch('/question/vote/:id', auth, questionController.voteQuestion)
router.get('/question/search', questionController.searchQuestion)

module.exports = router