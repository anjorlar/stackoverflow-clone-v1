const jwt = require('jsonwebtoken');
const User = require('../model/user/user');
const config = require('../config/settings');
const logger = require('../utils/logger')

/**
 * auth middleware
 * @param {*} req Http request object
 * @param {*} res Http response object
 * @param {*} next next middleware
 * @returns returns the authenticated user
 */

const auth = async (req, res, next) => {
    try {

        let token = req.header('Authorization')
        if (!token) {
            return res.status(401).send({
                code: 401,
                error: true,
                message: 'please provide an authorization token'
            });
        }
        token = token.replace('Bearer ', '')

        const decoded = jwt.verify(token, config.JWTSECRET)

        const id = decoded._id
        const user = await User.findOne({ _id: id, 'tokens.token': token }).exec()
        // console.log('>>>> decoded', decoded)
        // console.log('>>>> id', id)
        // console.log('>>>> token', token)
        if (!user) {
            throw new Error('decoded User not found')
        }
        req.token = token;
        req.user = user
        next()
    } catch (error) {
        console.log('error with auth:', error)
        logger.error('error with auth:', error)
        res.status(401).send({
            code: 401,
            error: true,
            message: 'Authentication is required'
        })
    }
}

module.exports = auth