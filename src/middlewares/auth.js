const jwt = require('jsonwebtoken');
const User = require('../model/user/user');
const config = require('../config/settings');
const logger = require('../utils/logger')

const auth = async (req, res, next) => {
    try {
        // console.log('req, req req >>>>>', req)
        let token = req.header('Authorization')
        if (!token) {
            return res.status(401).send({
                code: 401,
                error: true,
                message: 'please provide an authorization token'
            });
        }
        token = token.replace('Bearer ', '')
        // console.log('token token >>>>>>', token)
        const decoded = jwt.verify(token, config.JWTSECRET)
        // console.log('decoded >>>>>>', decoded)
        const id = decoded._id
        const user = await User.findOne({ _id: id, 'tokens.token': token }).exec()
        // console.log('>>>> auth user found', user)

        if (!user) {
            throw new Error('decoded User not found')
        }
        req.token = token;
        req.user = user
        next()
    } catch (error) {
        console.log('error', error)
        logger.error('error with auth', error)
        res.status(401).aend({
            code: 401,
            error: true,
            message: 'Authentication is required'
        })
    }
}

module.exports = auth