const mongoose = require('mongoose')
const followerModel = require('../model/follow');
const answerModel = require('../model/answers');


class AnswerService {
    //adds answer to the database
    add(data) {
        return answerModel.create(data)
    }

    getFollower(id) {
        return followerModel.find({ id, active: true })
            .select('email').exec()
    }

    searchAnswer(search, limit, page) {
        return answerModel.find(search)
            .limit(limit).skip(page)
            .sort({ title: 'asc' })
            .exec()
    }
}

const answerService = new AnswerService()
module.exports = answerService