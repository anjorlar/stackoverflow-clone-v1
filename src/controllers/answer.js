const mongoose = require('mongoose');
const questionService = require('../services/question');
const answerService = require('../services/answer');
const responseHelper = require('../libs/response');
const getCurrentTime = require('../utils/getDate');
const pagination = require('../libs/pagination');
const logger = require('../utils/logger');
const rabbitMq = require('../libs/rabbitmq');
const QUEUE_NAME = 'SUBSCRIBE'


class AnswersController {
    /**
     * @description Add answers to a question using after passing the questionId
     * @param {Object} req req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */

    async addAnswers(req, res) {
        const data = req.body
        const { questionId } = req.body
        if (!questionId) {
            return res.status(400)
                .send(responseHelper.error(400, 'questionId is required'))
        }
        const isValid = mongoose.Types.ObjectId.isValid(questionId)
        if (!isValid) {
            return res.status(400)
                .send(responseHelper.error(400, 'invalid Id'))
        }
        //gets question id
        const question = await questionService.getId(questionId)
        if (!question) {
            return res.status(400)
                .send(responseHelper.error(400, `Question with ${questionId} id does not exist`))
        }
        try {
            if (!data.title || !data.description) {
                return res.status(400).send(
                    responseHelper.error(400, `Please pass the title and description`)
                )
            }
            const date = getCurrentTime()
            const param = {
                title: data.title,
                description: data.description,
                date,
                question: questionId,
                owner: req.user._id
            }
            // param.owner = req.user._id
            //add answer to database
            const answers = await answerService.add(param)
            //checks if there are followers to the question
            const followers = await answerService.getFollower(questionId)
            let dataSentToQueue;
            if (followers.length > 0) {
                const queueData = {
                    data: followers,
                    question: question.title,
                    answer: {
                        title: param.title,
                        description: param.description
                    },
                    meta: {
                        module: 'Answer',
                        operation: 'add'
                    }
                };
                // push data to be sent to queue
                dataSentToQueue = await rabbitMq.sendQueue(QUEUE_NAME, queueData)
            };
            return res.status(200)
                .send(responseHelper.output(200, `answer saved and sent to question followers`, answers))
        } catch (error) {
            console.log('internal server error', error)
            return res.status(500).send(responseHelper.error(500, `internal server error`))

        }
    };

    async searchAnswers(req, res) {
        try {
            let { limit, page, a } = req.query
            limit = Number(limit)
            page = Number(page)
            if (!limit || !page) {
                limit = 10
                page = 0
            }
            if (!a) {
                return res.status(400)
                    .send(responseHelper.error(400, 'please add content to search'))
            }
            // search both field for content
            const search = {
                $or: [
                    {
                        title: {
                            $regex: a,
                            $options: 'i'
                        },
                        description: {
                            $regex: a,
                            $options: 'i'
                        }
                    }
                ]
            };
            const answers = await answerService.searchAnswer(search, limit, page)
            const count = answers.length;
            return res.status(200)
                .send(responseHelper.success(
                    200, 'All answers retrieved successfully',
                    answers, pagination(count, (limit, page))
                ));
        } catch (error) {
            console.error('internal server error', error)
            return res.status(500).send(responseHelper.error(500, `internal server error`))

        }
    };
}

const answersController = new AnswersController();
module.exports = answersController