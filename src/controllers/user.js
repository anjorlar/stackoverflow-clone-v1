'use strict'

const mongoose = require('mongoose');
const joi = require('joi')
const userService = require('../services/user');
const responseHelper = require('../libs/response');
const pagination = require('../libs/pagination');
const logger = require('../utils/logger');
const encryptionManager = require('../libs/encryption');


class UserController {
    /**
     * @description A user signs up when the required data is passed in the body
     * @param {Object} req  req - Http Request object
     * @param {Object} res  res - Http Response object
     * @returns {Object} returns object of the required response
     */
    async userSignUp(req, res) {
        try {
            let { name, email, password, lat, long } = req.body
            //check if all data is passed
            if (!name || !email || !password || !lat || !long) {
                return res.status(400)
                    .send(responseHelper.error(400, 'all field (name, email, password, lat, long) is required'))
            }

            //checks if user exist
            const userExist = await userService.getUser(email)
            if (userExist) {
                return res.status(400)
                    .send(responseHelper.error(400, 'user already exist'))
            }
            const coordinates = [Number(long), Number(lat)]
            const data = {
                email,
                name,
                password,
                type: 'Point',
                location: {
                    coordinates: coordinates
                }
            }
            // saves user
            const savedUser = await userService.createUser(data)
            await savedUser.generateAuthToken()
            await savedUser.save()
            console.log('>>>>>>', savedUser)
            return res.status(200)
                .send(responseHelper.output(200, 'user created successfully', savedUser))
        } catch (error) {
            console.error('internal server error', error)
            return res.status(500)
                .send(responseHelper.error(500, 'internal server error'))
        }
    }


    /**
     * @description A user logs in when the required data is passed in the body
     * @param {Object} req - Http Request object
     * @param {Object} res - Http Response object
     * @return {Object} returns object of the required response
     */
    async userLogin(req, res) {
        try {
            let { email, password } = req.body
            if (!email || !password) {
                return res.status(400).send(
                    responseHelper.error(400, `Please enter the correct email and password`)
                )
            }
            // get user details
            const user = await userService.getUser(email)
            if (user) {
                //compare password
                if (await encryptionManager.compareHashed(password, user.password)) {
                    await user.generateAuthToken()
                    return res.status(201).send(responseHelper.output(201, user))
                } else {
                    return res.status(400).send(responseHelper.success(400, 'Incorrect Password'))
                }
            } else {
                return res.status(400).send(responseHelper.error(400, 'User does not exist'))
            }

        } catch (error) {
            console.error('internal server error', error);
            return res.status(500).send(
                responseHelper.error(500, 'Internal server Error')
            )
        }
    }
    /**
     * @description A user logsout when the required data is passed in the body
     * @param {*} req Http Request object
     * @param {*} res Http Response object
     * @returns returns object of the required response
     */
    async userLogout(req, res) {
        try {
            // req.user['tokens'] = req.user['tokens'].filter(element => {
            //     return element.tokens !== req.token
            // })

            // console.log('>>>>>>>', req)
            req.user.tokens = req.user.tokens.filter(element => {
                return element.token !== req.token
            })
            await req.user.save()
            return res.status(200).send(responseHelper.output(200, 'logged out successful'))
        } catch (err) {
            console.error('internal server error', err)
            return res.status(500).send(responseHelper.error(500, 'Internal server Error'))
        }
    }

    /**
     * @description A user follows a question 
     * @param {*} req Http Request object
     * @param {*} res Http Response object
     * @returns returns object of the required response
     */
    async followQuestion(req, res) {
        try {
            const { questionId } = req.body
            if (!questionId) {
                return res.status(400).send(responseHelper.error(400, 'Question id is required'))
            }
            const question = mongoose.Types.ObjectId.isValid(questionId)
            if (!question) {
                return res
                    .status(400).send(responseHelper.error(400, `Invalid QuestionId`))
            }
            const data = {
                user: req.user._id,
                question: questionId,
                email: req.user.email
            }
            const follow = await userService.followQuestion(data)
            return res.status(200)
                .send(responseHelper.output(200, 'Question followed successfully', follow))
        } catch (err) {
            console.error('internal server error', err)
            return res.status(500).send(responseHelper.error(500, 'Internal Server Error'))
        }
    }

    /**
   * @description searches user
   * @param {*} req Http Request object
   * @param {*} res Http Response object
   * @returns returns object of the required response
   */
    async searchUser(req, res) {
        try {
            let { limit, page, s, lat, long } = req.query
            limit = parseInt(limit)
            page = Number(page)

            if (!limit || !page) {
                limit = 10,
                    page = 0
            }

            if (!lat || !long) {
                return res.status(400)
                    .send(responseHelper.error(400, 'Please pass the lat and long'))
            }

            // searches within 4km radius
            const search = {
                location: {
                    $near: {
                        $maxDistance: 4000,
                        $geometry: {
                            type: 'Point',
                            coordinates: [lat, long]
                        }
                    }
                }
            };

            const users = await userService.search(search, limit, page)
            const count = user.length
            const meta = {
                limit,
                page
            }
            const paginate = await pagination(count, meta)
            return res.status(200)
                .send(responseHelper.success(200, 'results for search gotten successfully', users, paginate))
        } catch (error) {
            console.error('internal server error', error)
            return res.status(500)
                .send(responseHelper.error(500, `internal server error`))
        }
    }
}
module.exports = new UserController()

// const userController = new UserController()
// module.exports = userController