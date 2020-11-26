const mongoose = require('mongoose');
const validator = require('validator');
const schemaMethods = require('./userMethods')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('not a valid Email')
            }
        }
    },
    name: {
        type: String,
        require: true,
        trim: true
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    tokens: [
        {
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

userSchema.index({ location: '2dsphere' })
schemaMethods(userSchema)

const User = mongoose.model('User', userSchema)
module.exports = User;