const userService = require('../services/user');
const responseHelper = require('../libs/response');
const pagination = require('../libs/pagination');
const logger = require('../utils/logger')
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
                .send(responseHelper.output(200, savedUser, 'user created successfully'))
        } catch (error) {
            console.error('internal server error', error)
            return res.status(500)
                .send(responseHelper.error(500, 'internal server error'))
        }
    }
}

const userController = new UserController()
module.exports = userController