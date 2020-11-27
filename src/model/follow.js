const mongoose = require('mongoose')

const followSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    email: {
        type: String
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const follow = mongoose.model('Follow', followSchema)

module.exports = follow;