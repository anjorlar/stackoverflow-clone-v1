'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config/settings')
const encryptionManager = require('../../libs/encryption')

// program to hash the plain text password before saving
// pre before saving and post after saving we using pre before we need it before is saves in the db
function methods(Schema) {
    Schema.pre('save', async function (next) {
        const user = this;
        if (user.isModified('password')) {
            const hash = await encryptionManager.getHashed(user.password);
            user.password = hash
        }
        next() //we call next to exit the function ie saving the user if next isn't called it will assume the function is still running hence the function will not exit hence not saving the user

    })

    // generates auth token
    // accesses the userSchema.statics.findByCredentials function, it is a method on the instance of the 'user'
    Schema.methods.generateAuthToken = async function () {
        const user = this;
        const access = config.ACCESSTYPE.USER;

        const token = jwt.sign({
            _id: user._id.toString(), email: user.email, name: user.name
        }, config.JWTSECRET);
        user.tokens = user.tokens.concat({ access, token })
        await user.save()
        return token
    };

    // hides private data
    // accesses the userSchema.statics.findByCredentials function and it is a method on the instance of the 'user'
    // THE toJSON(it must be exactly that toJSON) method deletes data he do not want to be sent as a response as we stated here
    Schema.methods.toJSON = function () {
        const user = this
        const newUser = user.toObject()
        delete newUser.password
        delete newUser.tokens
        return newUser
    }
};
module.exports = methods