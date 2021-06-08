const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 3,
        required: true,
        trim: true
    },
    description: {
        type: String,
        minlength: 6,
        required: true
    },
    date: {
        type: String
    },
    vote: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Question'
    }
}, { timestamps: true });

// hides private data
// accesses the userSchema.statics.findByCredentials function and it is a method on the instance of the 'user'
// THE toJSON(it must be exactly that toJSON) method deletes data he do not want to be sent as a response as we stated here
answerSchema.methods.toJSON = function () {
    const answer = this
    const newAnswer = answer.toObject()
    delete newAnswer.owner // deletes the id of the owner of the answer from the response been sent
    return newAnswer
}

answerSchema.index({ title: 'text', description: 'text' })
const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer