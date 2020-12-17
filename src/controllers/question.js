'use strict'

const mongoose = require('mongoose');
const questionService = require('../services/question');
const responseHelper = require('../libs/response')
const pagination = require('../libs/pagination');
const getCurrentTime = require('../utils/getDate');

class QuestionController {
    /**
     * @description A question is created when the required data is passed in the body
     * @param {Object} req  req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */

    async createQuestion(req, res) {
        try {
            let { title, description } = req.body
            const date = getCurrentTime()
            console.log('>>>>>>> date', date)
            if (!title) {
                return res.status(400)
                    .send(responseHelper.error(400, `title is required`))
            }
            if (!description) {
                return res.status(400)
                    .send(responseHelper.error(400, `description is required`))
            }
            const data = {
                title,
                description,
                date
            }
            // sets user id for question
            console.log('da MMMMMMMM te', date)
            data.owner = req.user._id
            const question = await questionService.addQuestion(data)
            // console.log('queestion ???????????', question)
            return res.status(201).send(responseHelper.success(201, 'question created successfully', question))
        } catch (error) {
            console.log('internal server error', error)
            return res.status(500)
                .send(responseHelper.error(500, `internal server error, ${error}`))
        }
    }


    /**
     * @description A question is viewed when the required data is passed
     * @param {Object} req  req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */

    async viewQuestion(req, res) {
        let { id } = req.params
        console.log('id ???????????', id)
        // id = id.toString()
        // console.log('id ????????id id id???', id)
        const isValid = mongoose.Types.ObjectId.isValid(id)
        console.log('iisValidd ???????????', isValid)
        if (!isValid) {
            return res.status(400).send(responseHelper.error(400, 'invalid id type'))
        }
        try {
            const question = await questionService.getId(id)
            if (!question) {
                return res.status(400)
                    .send(responseHelper.error(400, `Question with ${id} id does not exist`))
            }
            console.log('question', question)
            console.log('req.user._id', req.user._id)
            // get answers by virtual population
            const answers = await question.populate('answers').execPopulate()
            console.log(">>>>>>> viewQuestion answers", answers)
            return res.status(200)
                .send(
                    responseHelper.output(200, 'questions and answers gotten successfully',
                        { question, answers: question.answers }
                    ))
        } catch (error) {
            console.log('internal server error', error)
            return res.status(500).send(responseHelper.error(500, `internal server error`))
        }
    }


    /**
     * @description Update question by field
     * @param {Object} req  req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */
    async updateQuestion(req, res) {
        let { id } = req.params
        // let { title, description } = req.body
        // console.log('req body update question', title,description)
        const isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            return res.status(400).send(responseHelper.error(400, 'invalid Id'))
        }
        try {
            const data = req.body
            if (!data) {
                return res.status(400)
                    .send(responseHelper.error(400, `request body cannot be empty`))
            }
            const requiredValues = Object.keys(data)
            const allowedFields = ['title', 'description']
            //validate input fields
            const allowedUpdate = requiredValues.every(value =>
                allowedFields.includes(value))
            if (!allowedUpdate) {
                return res.status(400)
                    .send(responseHelper.error(400, `invalid request body`))
            }
            const question = await questionService.getId(id)
            if (!question) {
                return res.status(400)
                    .send(responseHelper.error(400, `question does not exist`))
            }
            // check that question to update belongs to owner
            if (question.owner.toString() !== req.user._id.toString()) {
                return res.status(400)
                    .send(responseHelper.error(400, `Question can only be editted by the owner`))
            }
            const updated = await questionService.updateById(id, data)
            console.log('updated >>>>>>>', updated)
            return res.status(200)
                .send(responseHelper.output(200, 'question updated successfully', updated))
        } catch (error) {
            console.log('internal server error', error)
            return res.status(500).send(responseHelper.error(500, 'internal server error'))
        }
    }

    /**
     * @description vote a question
     * @param {Object} req  req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */

    async voteQuestion(req, res) {
        let { id } = req.params
        const { vote } = req.body
        const isValid = mongoose.Types.ObjectId.isValid(id)
        if (!isValid) {
            return res.status(400)
                .send(responseHelper.error(400, `Invalid Id`))
        }
        //check that vote must be a type of boolean and also if a value was passed in the req.body,
        // downvote:false, upvote:true
        if (typeof vote !== 'boolean') {
            return res.status(400)
                .send(responseHelper.error(400, `invalid request vote must be a boolean`))
        }
        try {
            const question = await questionService.getId(id)
            if (!question) {
                return res.status(400)
                    .send(responseHelper.error(400, 'Question does not exist'))
            }
            if (question.owner.toString() === req.user._id.toString()) {
                return res.status(400)
                    .send(responseHelper.error(400, `You can not vote for a question you created`))
            }
            // increase or decrease vote base on input
            let value = 0;
            if (vote === false) {
                value = -1
                // value --
            } else {
                value = +1
                // value ++
            }
            //sets mongoose method for increment
            const incrementVal = {
                $inc: { vote: value }
            }
            const updatedVote = await questionService.updateById(id, incrementVal)
            return res.status(200)
                .send(responseHelper.output(200, 'vote recorded successfully', updatedVote))
        } catch (error) {
            console.log('internal server error', error)
            return res.status(500).send(responseHelper.error(500, 'internal server error'))
        }
    }
    /**
        * @description search question
        * @param {Object} req  req - Http Request object
        * @param {Object} res  res - Http Response object
        * @returns {Object} returns object of the required response
        */
    async searchQuestion(req, res) {
        try {
            let { limit, page, q } = req.query
            limit = parseInt(limit)
            page = parseInt(page)
            if (!limit || !page) {
                limit = 10,
                    page = 0
            }
            if (!q) {
                return res.status(400)
                    .send(responseHelper.error(400, 'please add content to search'))
            }
            // search both fields for content
            const search = {
                $or: [
                    {
                        title: {
                            $regex: q,
                            $options: 'i'
                        },
                        description: {
                            $regex: q,
                            $options: 'i'
                        }
                    }
                ]
            };
            const questions = await questionService.searchQuestion(search, limit, page)
            const count = questions.length;
            return res.status(200)
                .send(responseHelper.success(200, 'All questions retrieved successfully', questions, pagination(count, (limit, page))))

        } catch (error) {
            console.error('internal server error', error)
            return res.status(500).send(responseHelper.error(500, `internal server error`))
        }
    }
}

const questionController = new QuestionController()
module.exports = questionController