const mongoose = require('mongoose')
const questionModel = require('../model/questions')

class QuestionService {
    addQuestion(data) {
        console.log('>>>>>>>', data)
        return questionModel.create(data)
    }

    getId(id) {
        return questionModel.findOne({ _id: id })
    }

    updateById(id, data) {
        console.log('update by id', id, data['$inc'])
        return questionModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        }).lean()
            .exec()
    }

    searchQuestion(search, limit, page) {
        return questionModel.find(search)
            .limit(limit)
            .skip(page)
            .sort({ title: 'asc' })
            .exec()
    }
}

const questionService = new QuestionService()
module.exports = questionService