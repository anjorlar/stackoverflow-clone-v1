const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
    }
}, { timestamps: true })

/// hides private data
// accesses the userSchema.statics.findByCredentials function and it is a method on the instance of the 'user'
// THE toJSON(it must be exactly that toJSON) method deletes data he do not want to be sent as a response as we stated here

questionSchema.methods.toJSON = function () {
    const question = this
    const newQuestion = question.toObject()
    delete newQuestion.owner // deletes the id of the owner of the question from the response been sent
    return newQuestion
}

questionSchema.index({ title: 'text', description: 'text' })
// mapps question to answers
questionSchema.virtual('Answers', {
    ref: 'Answers',
    foreignField: 'Question',
    localField: '_id'
});
const Question = mongoose.model('Question', questionSchema)
module.exports = Question